"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createCost,
  createOffer,
  createSpecialOffer,
  createTreasurer,
  createTithe,
  deleteCost,
  deleteOffer,
  deleteSpecialOffer,
  deleteTithe,
  deleteTreasurer,
  fetchChurches,
  fetchCosts,
  fetchMembers,
  fetchOffers,
  fetchSpecialOffers,
  fetchTithes,
  fetchTreasurers,
  updateCost,
  updateOffer,
  updateSpecialOffer,
  updateTithe,
} from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import type {
  Church,
  CostRecord,
  MeResponse,
  MemberRecord,
  OfferRecord,
  SpecialOfferRecord,
  TitheRecord,
  TreasurerRecord,
} from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { DashboardStateNotice } from "./dashboard-state-notice";
import {
  EditIcon,
  FilterIcon,
  FinanceIcon,
  LeadershipIcon,
  LinkIcon,
  PlusIcon,
  WorkflowIcon,
} from "./portal-icons";

const treasurerSchema = z.object({
  id_member: z.string().min(1, "Selecione o membro."),
});

const costSchema = z.object({
  id_church: z.string().min(1, "Selecione a igreja."),
  value: z.string().min(1, "Informe o valor."),
  date: z.string().min(1, "Informe a data."),
  description: z.string().min(3, "Informe a descricao."),
});

const offerSchema = z.object({
  id_treasurer: z.string().min(1, "Selecione a tesouraria."),
  value: z.string().min(1, "Informe o valor."),
});

const specialOfferSchema = z.object({
  id_church: z.string().min(1, "Selecione a igreja."),
  id_member: z.string().min(1, "Selecione o membro responsavel."),
  id_treasurer: z.string().min(1, "Selecione a tesouraria."),
  value: z.string().min(1, "Informe o valor."),
  reason: z.string().min(3, "Informe o motivo."),
  date: z.string().min(1, "Informe a data."),
});

const titheSchema = z.object({
  id_church: z.string().min(1, "Selecione a igreja."),
  id_member: z.string().min(1, "Selecione o membro responsavel."),
  id_treasurer: z.string().min(1, "Selecione a tesouraria."),
  value: z.string().min(1, "Informe o valor."),
  reason: z.string().min(3, "Informe o motivo."),
  date: z.string().min(1, "Informe a data."),
  month: z.string().min(1, "Informe o mes."),
  year: z.string().min(4, "Informe o ano."),
});

type TreasurerValues = z.infer<typeof treasurerSchema>;
type CostValues = z.infer<typeof costSchema>;
type OfferValues = z.infer<typeof offerSchema>;
type SpecialOfferValues = z.infer<typeof specialOfferSchema>;
type TitheValues = z.infer<typeof titheSchema>;
type FinanceWorkspaceTab = "treasurer" | "costs" | "offers" | "tithes";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateString?: string | null) {
  if (!dateString) {
    return "Nao informado";
  }

  return new Intl.DateTimeFormat("pt-BR").format(new Date(dateString));
}

function getChurchLabel(church?: Church | null) {
  if (!church) {
    return "Igreja nao localizada";
  }

  if (!church.location) {
    return `Igreja #${church.id}`;
  }

  return `${church.type === "HEADQUARTER" ? "Sede" : "Congregacao"} • ${
    church.location.city
  }`;
}

function getMemberLabel(member?: MemberRecord | null) {
  if (!member) {
    return "Membro nao localizado";
  }

  return `${member.name} • Igreja #${member.id_church}`;
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function getQueryErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function FormNotice({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (error) {
    return (
      <div className="rounded-lg border border-ember/20 bg-ember/5 px-4 py-3 text-sm text-ember">
        {error}
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-lg border border-moss/20 bg-moss/5 px-4 py-3 text-sm text-moss">
        {success}
      </div>
    );
  }

  return null;
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
          Financeiro
        </p>
        <h3 className="font-display text-2xl text-ink">{title}</h3>
        {description ? (
          <p className="text-sm leading-6 text-ink/68">{description}</p>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function FinanceDashboard({ profile }: { profile: MeResponse }) {
  const { session } = useAuth();
  const [isAssigningTreasurer, startTreasurerTransition] = useTransition();
  const [isSubmittingCost, startCostTransition] = useTransition();
  const [isSubmittingOffer, startOfferTransition] = useTransition();
  const [isSubmittingSpecialOffer, startSpecialOfferTransition] = useTransition();
  const [isSubmittingTithe, startTitheTransition] = useTransition();
  const [isUpdatingCost, startCostUpdateTransition] = useTransition();
  const [isUpdatingOffer, startOfferUpdateTransition] = useTransition();
  const [isUpdatingSpecialOffer, startSpecialOfferUpdateTransition] = useTransition();
  const [isUpdatingTithe, startTitheUpdateTransition] = useTransition();
  const [treasurerFeedback, setTreasurerFeedback] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const [costFeedback, setCostFeedback] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const [offerFeedback, setOfferFeedback] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const [specialOfferFeedback, setSpecialOfferFeedback] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const [titheFeedback, setTitheFeedback] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const [costEditFeedback, setCostEditFeedback] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const [offerEditFeedback, setOfferEditFeedback] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const [specialOfferEditFeedback, setSpecialOfferEditFeedback] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const [titheEditFeedback, setTitheEditFeedback] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const [selectedCostId, setSelectedCostId] = useState<number | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [selectedSpecialOfferId, setSelectedSpecialOfferId] = useState<number | null>(null);
  const [selectedTitheId, setSelectedTitheId] = useState<number | null>(null);
  const [workflowTab, setWorkflowTab] = useState<FinanceWorkspaceTab>("treasurer");
  const [filterChurchId, setFilterChurchId] = useState(
    profile.access?.scope === "CHURCH"
      ? String(profile.access?.churchId ?? profile.member.id_church)
      : "all"
  );
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const canEditFinancialData = Boolean(profile.permissions?.canEditManagementData);
  const defaultChurchId = String(profile.access?.churchId ?? profile.member.id_church);

  const churchesQuery = useQuery({
    queryKey: ["finance-churches", session?.token],
    queryFn: () => fetchChurches(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const membersQuery = useQuery({
    queryKey: ["finance-members", session?.token],
    queryFn: () => fetchMembers(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const treasurersQuery = useQuery({
    queryKey: ["finance-treasurers", session?.token],
    queryFn: () => fetchTreasurers(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const costsQuery = useQuery({
    queryKey: ["finance-costs", session?.token],
    queryFn: () => fetchCosts(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const offersQuery = useQuery({
    queryKey: ["finance-offers", session?.token],
    queryFn: () => fetchOffers(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const specialOffersQuery = useQuery({
    queryKey: ["finance-special-offers", session?.token],
    queryFn: () => fetchSpecialOffers(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const tithesQuery = useQuery({
    queryKey: ["finance-tithes", session?.token],
    queryFn: () => fetchTithes(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const treasurerForm = useForm<TreasurerValues>({
    resolver: zodResolver(treasurerSchema),
    defaultValues: {
      id_member: "",
    },
  });

  const costForm = useForm<CostValues>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      id_church: defaultChurchId,
      value: "",
      date: "",
      description: "",
    },
  });

  const offerForm = useForm<OfferValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      id_treasurer: "",
      value: "",
    },
  });

  const specialOfferForm = useForm<SpecialOfferValues>({
    resolver: zodResolver(specialOfferSchema),
    defaultValues: {
      id_church: defaultChurchId,
      id_member: "",
      id_treasurer: "",
      value: "",
      reason: "",
      date: "",
    },
  });

  const titheForm = useForm<TitheValues>({
    resolver: zodResolver(titheSchema),
    defaultValues: {
      id_church: defaultChurchId,
      id_member: "",
      id_treasurer: "",
      value: "",
      reason: "",
      date: "",
      month: "",
      year: "",
    },
  });
  const costEditForm = useForm<CostValues>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      id_church: defaultChurchId,
      value: "",
      date: "",
      description: "",
    },
  });
  const offerEditForm = useForm<OfferValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      id_treasurer: "",
      value: "",
    },
  });
  const specialOfferEditForm = useForm<SpecialOfferValues>({
    resolver: zodResolver(specialOfferSchema),
    defaultValues: {
      id_church: defaultChurchId,
      id_member: "",
      id_treasurer: "",
      value: "",
      reason: "",
      date: "",
    },
  });
  const titheEditForm = useForm<TitheValues>({
    resolver: zodResolver(titheSchema),
    defaultValues: {
      id_church: defaultChurchId,
      id_member: "",
      id_treasurer: "",
      value: "",
      reason: "",
      date: "",
      month: "",
      year: "",
    },
  });

  const churches = useMemo(() => churchesQuery.data?.churches ?? [], [churchesQuery.data?.churches]);
  const members = useMemo(() => membersQuery.data?.members ?? [], [membersQuery.data?.members]);
  const treasurers = useMemo(() => treasurersQuery.data?.treasurers ?? [], [treasurersQuery.data?.treasurers]);
  const costs = useMemo(() => costsQuery.data?.costs ?? [], [costsQuery.data?.costs]);
  const offers = useMemo(() => offersQuery.data?.offers ?? [], [offersQuery.data?.offers]);
  const specialOffers = useMemo(
    () => specialOffersQuery.data?.specialOffers ?? [],
    [specialOffersQuery.data?.specialOffers]
  );
  const tithes = useMemo(() => tithesQuery.data?.tithes ?? [], [tithesQuery.data?.tithes]);
  const normalizedSearch = useMemo(() => normalizeSearch(searchTerm), [searchTerm]);

  const churchOptions = useMemo(
    () =>
      churches
        .filter((church) => church.status !== "DELETED")
        .map((church) => ({
          value: String(church.id),
          label: `${getChurchLabel(church)} • #${church.id}`,
        })),
    [churches]
  );

  const memberById = useMemo(
    () => new Map(members.map((member) => [member.id, member])),
    [members]
  );
  const churchById = useMemo(
    () => new Map(churches.map((church) => [church.id, church])),
    [churches]
  );
  const treasurerById = useMemo(
    () => new Map(treasurers.map((treasurer) => [treasurer.id, treasurer])),
    [treasurers]
  );
  const offerById = useMemo(
    () => new Map(offers.map((offer) => [offer.id, offer])),
    [offers]
  );

  const availableYears = useMemo(() => {
    const years = new Set<string>();

    costs.forEach((cost) => years.add(String(new Date(cost.date).getFullYear())));
    specialOffers.forEach((specialOffer) =>
      years.add(String(new Date(specialOffer.date).getFullYear()))
    );
    tithes.forEach((tithe) => years.add(String(tithe.year)));

    return [...years].sort((left, right) => Number(right) - Number(left));
  }, [costs, specialOffers, tithes]);

  const activeTreasurerMemberIds = useMemo(
    () => new Set(treasurers.map((treasurer) => treasurer.id_member)),
    [treasurers]
  );

  const eligibleTreasurerMembers = useMemo(
    () => members.filter((member) => !activeTreasurerMemberIds.has(member.id)),
    [activeTreasurerMemberIds, members]
  );

  const treasurerMemberOptions = useMemo(
    () =>
      eligibleTreasurerMembers.map((member) => ({
        value: String(member.id),
        label: getMemberLabel(member),
      })),
    [eligibleTreasurerMembers]
  );

  const offerTreasurerOptions = useMemo(
    () =>
      treasurers.map((treasurer) => ({
        value: String(treasurer.id),
        label: `${getMemberLabel(members.find((member) => member.id === treasurer.id_member))} • Tesouraria #${treasurer.id}`,
      })),
    [members, treasurers]
  );

  const specialOfferChurchId = specialOfferForm.watch("id_church");
  const specialOfferEditChurchId = specialOfferEditForm.watch("id_church");
  const titheChurchId = titheForm.watch("id_church");
  const titheEditChurchId = titheEditForm.watch("id_church");

  const specialOfferMembers = useMemo(
    () =>
      members
        .filter((member) =>
          specialOfferChurchId ? String(member.id_church) === specialOfferChurchId : true
        )
        .map((member) => ({
          value: String(member.id),
          label: getMemberLabel(member),
        })),
    [members, specialOfferChurchId]
  );

  const specialOfferTreasurers = useMemo(
    () =>
      treasurers
        .filter((treasurer) => {
          const member = members.find((item) => item.id === treasurer.id_member);
          return specialOfferChurchId ? String(member?.id_church) === specialOfferChurchId : true;
        })
        .map((treasurer) => ({
          value: String(treasurer.id),
          label: `${getMemberLabel(members.find((member) => member.id === treasurer.id_member))} • Tesouraria #${treasurer.id}`,
        })),
    [members, specialOfferChurchId, treasurers]
  );

  const titheMembers = useMemo(
    () =>
      members
        .filter((member) =>
          titheChurchId ? String(member.id_church) === titheChurchId : true
        )
        .map((member) => ({
          value: String(member.id),
          label: getMemberLabel(member),
        })),
    [members, titheChurchId]
  );

  const titheTreasurers = useMemo(
    () =>
      treasurers
        .filter((treasurer) => {
          const member = members.find((item) => item.id === treasurer.id_member);
          return titheChurchId ? String(member?.id_church) === titheChurchId : true;
        })
        .map((treasurer) => ({
          value: String(treasurer.id),
          label: `${getMemberLabel(members.find((member) => member.id === treasurer.id_member))} • Tesouraria #${treasurer.id}`,
        })),
    [members, titheChurchId, treasurers]
  );
  const specialOfferEditMembers = useMemo(
    () =>
      members
        .filter((member) =>
          specialOfferEditChurchId ? String(member.id_church) === specialOfferEditChurchId : true
        )
        .map((member) => ({
          value: String(member.id),
          label: getMemberLabel(member),
        })),
    [members, specialOfferEditChurchId]
  );

  const specialOfferEditTreasurers = useMemo(
    () =>
      treasurers
        .filter((treasurer) => {
          const member = members.find((item) => item.id === treasurer.id_member);
          return specialOfferEditChurchId
            ? String(member?.id_church) === specialOfferEditChurchId
            : true;
        })
        .map((treasurer) => ({
          value: String(treasurer.id),
          label: `${getMemberLabel(members.find((member) => member.id === treasurer.id_member))} • Tesouraria #${treasurer.id}`,
        })),
    [members, specialOfferEditChurchId, treasurers]
  );

  const titheEditMembers = useMemo(
    () =>
      members
        .filter((member) =>
          titheEditChurchId ? String(member.id_church) === titheEditChurchId : true
        )
        .map((member) => ({
          value: String(member.id),
          label: getMemberLabel(member),
        })),
    [members, titheEditChurchId]
  );

  const titheEditTreasurers = useMemo(
    () =>
      treasurers
        .filter((treasurer) => {
          const member = members.find((item) => item.id === treasurer.id_member);
          return titheEditChurchId ? String(member?.id_church) === titheEditChurchId : true;
        })
        .map((treasurer) => ({
          value: String(treasurer.id),
          label: `${getMemberLabel(members.find((member) => member.id === treasurer.id_member))} • Tesouraria #${treasurer.id}`,
        })),
    [members, titheEditChurchId, treasurers]
  );

  const selectedCost = useMemo(
    () => costs.find((cost) => cost.id === selectedCostId) ?? null,
    [costs, selectedCostId]
  );
  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOfferId) ?? null,
    [offers, selectedOfferId]
  );
  const selectedSpecialOffer = useMemo(
    () =>
      specialOffers.find((specialOffer) => specialOffer.id === selectedSpecialOfferId) ??
      null,
    [selectedSpecialOfferId, specialOffers]
  );
  const selectedTithe = useMemo(
    () => tithes.find((tithe) => tithe.id === selectedTitheId) ?? null,
    [selectedTitheId, tithes]
  );

  const filteredTreasurers = useMemo(() => {
    return treasurers.filter((treasurer) => {
      const member = memberById.get(treasurer.id_member);
      const churchId = member?.id_church;

      if (filterChurchId !== "all" && String(churchId) !== filterChurchId) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return normalizeSearch(getMemberLabel(member)).includes(normalizedSearch);
    });
  }, [filterChurchId, memberById, normalizedSearch, treasurers]);

  const filteredCosts = useMemo(() => {
    return costs.filter((cost) => {
      const costDate = new Date(cost.date);

      if (filterChurchId !== "all" && String(cost.id_church) !== filterChurchId) {
        return false;
      }

      if (filterYear !== "all" && String(costDate.getFullYear()) !== filterYear) {
        return false;
      }

      if (filterMonth !== "all" && String(costDate.getMonth() + 1) !== filterMonth) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return normalizeSearch(cost.description).includes(normalizedSearch);
    });
  }, [costs, filterChurchId, filterMonth, filterYear, normalizedSearch]);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const treasurer = treasurerById.get(offer.id_treasurer);
      const member = treasurer ? memberById.get(treasurer.id_member) : undefined;

      if (filterChurchId !== "all" && String(member?.id_church) !== filterChurchId) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return normalizeSearch(
        `${member?.name ?? ""} ${member?.email ?? ""} ${offer.id}`
      ).includes(normalizedSearch);
    });
  }, [filterChurchId, memberById, normalizedSearch, offers, treasurerById]);

  const filteredSpecialOffers = useMemo(() => {
    return specialOffers.filter((specialOffer) => {
      const specialOfferDate = new Date(specialOffer.date);
      const member = memberById.get(specialOffer.id_member);

      if (
        filterChurchId !== "all" &&
        String(specialOffer.id_church) !== filterChurchId
      ) {
        return false;
      }

      if (filterYear !== "all" && String(specialOfferDate.getFullYear()) !== filterYear) {
        return false;
      }

      if (filterMonth !== "all" && String(specialOfferDate.getMonth() + 1) !== filterMonth) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return normalizeSearch(
        `${specialOffer.reason} ${member?.name ?? ""}`
      ).includes(normalizedSearch);
    });
  }, [filterChurchId, filterMonth, filterYear, memberById, normalizedSearch, specialOffers]);

  const filteredTithes = useMemo(() => {
    return tithes.filter((tithe) => {
      const specialOffer = tithe.specialOffer;
      const member = specialOffer ? memberById.get(specialOffer.id_member) : undefined;
      const churchId = specialOffer?.id_church;

      if (filterChurchId !== "all" && String(churchId) !== filterChurchId) {
        return false;
      }

      if (filterYear !== "all" && String(tithe.year) !== filterYear) {
        return false;
      }

      if (filterMonth !== "all" && String(tithe.month) !== filterMonth) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return normalizeSearch(
        `${specialOffer?.reason ?? ""} ${member?.name ?? ""} ${tithe.month}/${tithe.year}`
      ).includes(normalizedSearch);
    });
  }, [filterChurchId, filterMonth, filterYear, memberById, normalizedSearch, tithes]);
  const isLoadingFinanceData =
    (churchesQuery.isLoading && !churches.length) ||
    (membersQuery.isLoading && !members.length) ||
    (treasurersQuery.isLoading && !treasurers.length) ||
    (costsQuery.isLoading && !costs.length) ||
    (offersQuery.isLoading && !offers.length) ||
    (specialOffersQuery.isLoading && !specialOffers.length) ||
    (tithesQuery.isLoading && !tithes.length);
  const financeDataError =
    churchesQuery.error ||
    membersQuery.error ||
    treasurersQuery.error ||
    costsQuery.error ||
    offersQuery.error ||
    specialOffersQuery.error ||
    tithesQuery.error
      ? getQueryErrorMessage(
          churchesQuery.error ??
            membersQuery.error ??
            treasurersQuery.error ??
            costsQuery.error ??
            offersQuery.error ??
            specialOffersQuery.error ??
            tithesQuery.error,
          "Nao foi possivel carregar os dados financeiros deste escopo."
        )
      : null;

  async function refreshFinanceData() {
    await Promise.all([
      treasurersQuery.refetch(),
      costsQuery.refetch(),
      offersQuery.refetch(),
      specialOffersQuery.refetch(),
      tithesQuery.refetch(),
    ]);
  }

  function loadCostEditor(cost: CostRecord) {
    setWorkflowTab("costs");
    setSelectedCostId(cost.id);
    setCostEditFeedback({ error: null, success: null });
    costEditForm.reset({
      id_church: String(cost.id_church),
      value: String(cost.value),
      date: cost.date.slice(0, 10),
      description: cost.description,
    });
  }

  function loadOfferEditor(offer: OfferRecord) {
    setWorkflowTab("offers");
    setSelectedOfferId(offer.id);
    setOfferEditFeedback({ error: null, success: null });
    offerEditForm.reset({
      id_treasurer: String(offer.id_treasurer),
      value: String(offer.value),
    });
  }

  function loadSpecialOfferEditor(specialOffer: SpecialOfferRecord) {
    setWorkflowTab("offers");
    const offer = offerById.get(specialOffer.id_offer);
    setSelectedSpecialOfferId(specialOffer.id);
    setSpecialOfferEditFeedback({ error: null, success: null });
    specialOfferEditForm.reset({
      id_church: String(specialOffer.id_church),
      id_member: String(specialOffer.id_member),
      id_treasurer: offer ? String(offer.id_treasurer) : "",
      value: offer ? String(offer.value) : "",
      reason: specialOffer.reason,
      date: specialOffer.date.slice(0, 10),
    });
  }

  function loadTitheEditor(tithe: TitheRecord) {
    setWorkflowTab("tithes");
    const specialOffer = tithe.specialOffer;
    const offer = specialOffer?.offer;
    setSelectedTitheId(tithe.id);
    setTitheEditFeedback({ error: null, success: null });
    titheEditForm.reset({
      id_church: specialOffer ? String(specialOffer.id_church) : defaultChurchId,
      id_member: specialOffer ? String(specialOffer.id_member) : "",
      id_treasurer: offer ? String(offer.id_treasurer) : "",
      value: offer ? String(offer.value) : "",
      reason: specialOffer?.reason ?? "",
      date: specialOffer?.date?.slice(0, 10) ?? "",
      month: String(tithe.month),
      year: String(tithe.year),
    });
  }

  const financialSummary = useMemo(() => {
    const totalCosts = filteredCosts.reduce((sum, item) => sum + item.value, 0);
    const totalOffers = filteredOffers.reduce((sum, item) => sum + item.value, 0);
    const totalSpecialOffers = filteredSpecialOffers.reduce((sum, item) => {
      const offer = offerById.get(item.id_offer);
      return sum + (offer?.value ?? 0);
    }, 0);
    const totalTithes = filteredTithes.reduce((sum, item) => {
      const value = item.specialOffer?.offer?.value;
      return sum + (typeof value === "number" ? value : 0);
    }, 0);

    return [
      { label: "Tesourarias ativas", value: String(filteredTreasurers.length) },
      { label: "Despesas registradas", value: formatCurrency(totalCosts) },
      { label: "Ofertas base", value: formatCurrency(totalOffers) },
      { label: "Ofertas especiais", value: formatCurrency(totalSpecialOffers) },
      { label: "Dizimos rastreados", value: formatCurrency(totalTithes) },
    ];
  }, [
    filteredCosts,
    filteredOffers,
    filteredSpecialOffers,
    filteredTithes,
    filteredTreasurers.length,
    offerById,
  ]);
  const workflowOptions = useMemo(
    () => [
      { value: "treasurer" as const, label: "Tesouraria", icon: LeadershipIcon },
      { value: "costs" as const, label: "Despesas", icon: FinanceIcon },
      { value: "offers" as const, label: "Ofertas", icon: LinkIcon },
      { value: "tithes" as const, label: "Dizimos", icon: WorkflowIcon },
    ],
    []
  );

  const onAssignTreasurer = treasurerForm.handleSubmit(async (values) => {
    if (!session) return;

    setTreasurerFeedback({ error: null, success: null });

    startTreasurerTransition(async () => {
      try {
        await createTreasurer(session.token, Number(values.id_member));
        treasurerForm.reset({ id_member: "" });
        await refreshFinanceData();
        setTreasurerFeedback({
          error: null,
          success: "Tesouraria ativa vinculada ao membro selecionado.",
        });
      } catch (error) {
        setTreasurerFeedback({
          error: error instanceof Error ? error.message : "Nao foi possivel vincular a tesouraria.",
          success: null,
        });
      }
    });
  });

  const onCreateCost = costForm.handleSubmit(async (values) => {
    if (!session) return;

    setCostFeedback({ error: null, success: null });

    startCostTransition(async () => {
      try {
        await createCost(session.token, {
          id_church: Number(values.id_church),
          value: Number(values.value.replace(",", ".")),
          date: values.date,
          description: values.description,
        });
        costForm.reset({
          id_church: values.id_church,
          value: "",
          date: "",
          description: "",
        });
        await refreshFinanceData();
        setCostFeedback({ error: null, success: "Despesa registrada com sucesso." });
      } catch (error) {
        setCostFeedback({
          error: error instanceof Error ? error.message : "Nao foi possivel registrar a despesa.",
          success: null,
        });
      }
    });
  });

  const onCreateOffer = offerForm.handleSubmit(async (values) => {
    if (!session) return;

    setOfferFeedback({ error: null, success: null });

    startOfferTransition(async () => {
      try {
        await createOffer(session.token, {
          id_treasurer: Number(values.id_treasurer),
          value: Number(values.value.replace(",", ".")),
        });
        offerForm.reset({
          id_treasurer: values.id_treasurer,
          value: "",
        });
        await refreshFinanceData();
        setOfferFeedback({ error: null, success: "Oferta base registrada com sucesso." });
      } catch (error) {
        setOfferFeedback({
          error: error instanceof Error ? error.message : "Nao foi possivel registrar a oferta.",
          success: null,
        });
      }
    });
  });

  const onCreateSpecialOffer = specialOfferForm.handleSubmit(async (values) => {
    if (!session) return;

    setSpecialOfferFeedback({ error: null, success: null });

    startSpecialOfferTransition(async () => {
      try {
        await createSpecialOffer(session.token, {
          id_church: Number(values.id_church),
          id_member: Number(values.id_member),
          id_treasurer: Number(values.id_treasurer),
          value: Number(values.value.replace(",", ".")),
          reason: values.reason,
          date: values.date,
        });
        specialOfferForm.reset({
          id_church: values.id_church,
          id_member: "",
          id_treasurer: "",
          value: "",
          reason: "",
          date: "",
        });
        await refreshFinanceData();
        setSpecialOfferFeedback({
          error: null,
          success: "Oferta especial registrada com sucesso.",
        });
      } catch (error) {
        setSpecialOfferFeedback({
          error: error instanceof Error ? error.message : "Nao foi possivel registrar a oferta especial.",
          success: null,
        });
      }
    });
  });

  const onCreateTithe = titheForm.handleSubmit(async (values) => {
    if (!session) return;

    setTitheFeedback({ error: null, success: null });

    startTitheTransition(async () => {
      try {
        await createTithe(session.token, {
          id_church: Number(values.id_church),
          id_member: Number(values.id_member),
          id_treasurer: Number(values.id_treasurer),
          value: Number(values.value.replace(",", ".")),
          reason: values.reason,
          date: values.date,
          month: Number(values.month),
          year: Number(values.year),
        });
        titheForm.reset({
          id_church: values.id_church,
          id_member: "",
          id_treasurer: "",
          value: "",
          reason: "",
          date: "",
          month: "",
          year: "",
        });
        await refreshFinanceData();
        setTitheFeedback({ error: null, success: "Dizimo registrado com sucesso." });
      } catch (error) {
        setTitheFeedback({
          error: error instanceof Error ? error.message : "Nao foi possivel registrar o dizimo.",
          success: null,
        });
      }
    });
  });

  const onUpdateCost = costEditForm.handleSubmit(async (values) => {
    if (!session || !selectedCost) return;

    setCostEditFeedback({ error: null, success: null });

    startCostUpdateTransition(async () => {
      try {
        await updateCost(session.token, selectedCost.id, {
          value: Number(values.value.replace(",", ".")),
          date: values.date,
          description: values.description,
        });
        await refreshFinanceData();
        setCostEditFeedback({ error: null, success: "Despesa atualizada com sucesso." });
      } catch (error) {
        setCostEditFeedback({
          error: error instanceof Error ? error.message : "Nao foi possivel atualizar a despesa.",
          success: null,
        });
      }
    });
  });

  const onUpdateOffer = offerEditForm.handleSubmit(async (values) => {
    if (!session || !selectedOffer) return;

    setOfferEditFeedback({ error: null, success: null });

    startOfferUpdateTransition(async () => {
      try {
        await updateOffer(session.token, selectedOffer.id, {
          id_treasurer: Number(values.id_treasurer),
          value: Number(values.value.replace(",", ".")),
        });
        await refreshFinanceData();
        setOfferEditFeedback({ error: null, success: "Oferta atualizada com sucesso." });
      } catch (error) {
        setOfferEditFeedback({
          error: error instanceof Error ? error.message : "Nao foi possivel atualizar a oferta.",
          success: null,
        });
      }
    });
  });

  const onUpdateSpecialOffer = specialOfferEditForm.handleSubmit(async (values) => {
    if (!session || !selectedSpecialOffer) return;

    setSpecialOfferEditFeedback({ error: null, success: null });

    startSpecialOfferUpdateTransition(async () => {
      try {
        await updateSpecialOffer(session.token, selectedSpecialOffer.id, {
          id_church: Number(values.id_church),
          id_member: Number(values.id_member),
          id_treasurer: Number(values.id_treasurer),
          value: Number(values.value.replace(",", ".")),
          reason: values.reason,
          date: values.date,
        });
        await refreshFinanceData();
        setSpecialOfferEditFeedback({
          error: null,
          success: "Oferta especial atualizada com sucesso.",
        });
      } catch (error) {
        setSpecialOfferEditFeedback({
          error:
            error instanceof Error
              ? error.message
              : "Nao foi possivel atualizar a oferta especial.",
          success: null,
        });
      }
    });
  });

  const onUpdateTithe = titheEditForm.handleSubmit(async (values) => {
    if (!session || !selectedTithe) return;

    setTitheEditFeedback({ error: null, success: null });

    startTitheUpdateTransition(async () => {
      try {
        await updateTithe(session.token, selectedTithe.id, {
          id_church: Number(values.id_church),
          id_member: Number(values.id_member),
          id_treasurer: Number(values.id_treasurer),
          value: Number(values.value.replace(",", ".")),
          reason: values.reason,
          date: values.date,
          month: Number(values.month),
          year: Number(values.year),
        });
        await refreshFinanceData();
        setTitheEditFeedback({ error: null, success: "Dizimo atualizado com sucesso." });
      } catch (error) {
        setTitheEditFeedback({
          error: error instanceof Error ? error.message : "Nao foi possivel atualizar o dizimo.",
          success: null,
        });
      }
    });
  });

  async function handleDeleteCost(cost: CostRecord) {
    if (!session || !window.confirm(`Deseja excluir a despesa "${cost.description}"?`)) {
      return;
    }

    try {
      await deleteCost(session.token, cost.id);
      if (selectedCostId === cost.id) {
        setSelectedCostId(null);
      }
      await refreshFinanceData();
      setCostFeedback({ error: null, success: "Despesa excluida com sucesso." });
    } catch (error) {
      setCostFeedback({
        error: error instanceof Error ? error.message : "Nao foi possivel excluir a despesa.",
        success: null,
      });
    }
  }

  async function handleDeleteOffer(offer: OfferRecord) {
    if (!session || !window.confirm(`Deseja excluir a oferta #${offer.id}?`)) {
      return;
    }

    try {
      await deleteOffer(session.token, offer.id);
      if (selectedOfferId === offer.id) {
        setSelectedOfferId(null);
      }
      await refreshFinanceData();
      setOfferFeedback({ error: null, success: "Oferta excluida com sucesso." });
    } catch (error) {
      setOfferFeedback({
        error: error instanceof Error ? error.message : "Nao foi possivel excluir a oferta.",
        success: null,
      });
    }
  }

  async function handleDeleteTithe(tithe: TitheRecord) {
    if (!session || !window.confirm(`Deseja excluir o dizimo #${tithe.id}?`)) {
      return;
    }

    try {
      await deleteTithe(session.token, tithe.id);
      if (selectedTitheId === tithe.id) {
        setSelectedTitheId(null);
      }
      await refreshFinanceData();
      setTitheFeedback({ error: null, success: "Dizimo excluido com sucesso." });
    } catch (error) {
      setTitheFeedback({
        error: error instanceof Error ? error.message : "Nao foi possivel excluir o dizimo.",
        success: null,
      });
    }
  }

  async function handleDeleteTreasurer(treasurer: TreasurerRecord) {
    if (
      !session ||
      !window.confirm(`Deseja encerrar a tesouraria vinculada ao membro #${treasurer.id_member}?`)
    ) {
      return;
    }

    try {
      await deleteTreasurer(session.token, treasurer.id);
      await refreshFinanceData();
      setTreasurerFeedback({
        error: null,
        success: "Tesouraria encerrada com sucesso.",
      });
    } catch (error) {
      setTreasurerFeedback({
        error: error instanceof Error ? error.message : "Nao foi possivel encerrar a tesouraria.",
        success: null,
      });
    }
  }

  async function handleDeleteSpecialOffer(specialOffer: SpecialOfferRecord) {
    if (
      !session ||
      !window.confirm(`Deseja excluir a oferta especial "${specialOffer.reason}"?`)
    ) {
      return;
    }

    try {
      await deleteSpecialOffer(session.token, specialOffer.id);
      if (selectedSpecialOfferId === specialOffer.id) {
        setSelectedSpecialOfferId(null);
      }
      await refreshFinanceData();
      setSpecialOfferFeedback({
        error: null,
        success: "Oferta especial excluida com sucesso.",
      });
    } catch (error) {
      setSpecialOfferFeedback({
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel excluir a oferta especial.",
        success: null,
      });
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {financialSummary.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel backdrop-blur"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
              {item.label}
            </p>
            <p className="mt-3 break-words font-display text-2xl text-ink sm:text-3xl">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
          Visao operacional
        </p>
        <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          Financeiro
        </h3>
      </section>

      <DashboardStateNotice
        loading={isLoadingFinanceData}
        error={financeDataError}
        loadingLabel="Carregando tesourarias, ofertas, despesas e dizimos..."
      />

      <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
              Filtros locais
            </p>
            <h3 className="font-display text-2xl text-ink">
              Consolidacao por igreja, periodo e busca textual.
            </h3>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select
            label="Igreja"
            disabled={profile.access?.scope === "CHURCH"}
            value={filterChurchId}
            onChange={(event) => setFilterChurchId(event.target.value)}
          >
            <option value="all">Todas as igrejas</option>
            {churchOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            label="Mes"
            value={filterMonth}
            onChange={(event) => setFilterMonth(event.target.value)}
          >
            <option value="all">Todos os meses</option>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={String(index + 1)}>
                {String(index + 1).padStart(2, "0")}
              </option>
            ))}
          </Select>

          <Select
            label="Ano"
            value={filterYear}
            onChange={(event) => setFilterYear(event.target.value)}
          >
            <option value="all">Todos os anos</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>

          <Input
            label="Buscar"
            placeholder="motivo, descricao, membro"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Despesas filtradas
          </p>
          <p className="mt-3 font-display text-3xl text-ink">
            {filteredCosts.length}
          </p>
          <p className="mt-2 text-sm text-ink/62">
            Total atual: {formatCurrency(filteredCosts.reduce((sum, item) => sum + item.value, 0))}
          </p>
        </div>
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Ofertas especiais filtradas
          </p>
          <p className="mt-3 font-display text-3xl text-ink">
            {filteredSpecialOffers.length}
          </p>
          <p className="mt-2 text-sm text-ink/62">
            Valores vinculados: {formatCurrency(filteredSpecialOffers.reduce((sum, item) => sum + (offerById.get(item.id_offer)?.value ?? 0), 0))}
          </p>
        </div>
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Dizimos filtrados
          </p>
          <p className="mt-3 font-display text-3xl text-ink">
            {filteredTithes.length}
          </p>
          <p className="mt-2 text-sm text-ink/62">
            Valores rastreados: {formatCurrency(filteredTithes.reduce((sum, item) => sum + (item.specialOffer?.offer?.value ?? 0), 0))}
          </p>
        </div>
      </section>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <div className="space-y-6">
          <Panel
            title="Tesourarias ativas"
            description="Tesourarias do escopo atual."
          >
            <div className="space-y-3">
              {filteredTreasurers.map((treasurer) => {
                const member = memberById.get(treasurer.id_member);
                const church = churchById.get(member?.id_church ?? -1);

                return (
                  <div
                    key={treasurer.id}
                    className="flex flex-col gap-4 rounded-lg border border-line bg-stone p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-ink">{getMemberLabel(member)}</p>
                      <p className="mt-1 text-sm text-ink/62">
                        {getChurchLabel(church)} • desde {formatDate(treasurer.startDate)}
                      </p>
                    </div>

                    {canEditFinancialData ? (
                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <Button
                          variant="secondary"
                          className="w-full sm:w-auto"
                          onClick={() => void handleDeleteTreasurer(treasurer)}
                        >
                          Encerrar
                        </Button>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <DashboardStateNotice
                empty={!isLoadingFinanceData && !financeDataError && !filteredTreasurers.length}
                emptyLabel="Nenhuma tesouraria encontrada com os filtros atuais."
              />
            </div>
          </Panel>

          <Panel title="Despesas" description="Saidas financeiras registradas por igreja.">
            <div className="space-y-3">
              {filteredCosts.map((cost) => {
                const church = churchById.get(cost.id_church);

                return (
                  <div
                    key={cost.id}
                    className="flex flex-col gap-4 rounded-lg border border-line bg-stone p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-ink">{cost.description}</p>
                      <p className="mt-1 text-sm text-ink/62">
                        {getChurchLabel(church)} • {formatDate(cost.date)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <span className="text-sm font-semibold text-ink">
                        {formatCurrency(cost.value)}
                      </span>
                      {canEditFinancialData ? (
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                          <Button
                            variant="secondary"
                            className="w-full sm:w-auto"
                            onClick={() => loadCostEditor(cost)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full text-ember hover:bg-ember/8 hover:text-ember sm:w-auto"
                            onClick={() => void handleDeleteCost(cost)}
                          >
                            Excluir
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              <DashboardStateNotice
                empty={!isLoadingFinanceData && !financeDataError && !filteredCosts.length}
                emptyLabel="Nenhuma despesa encontrada com os filtros atuais."
              />
            </div>
          </Panel>

          <Panel title="Ofertas e dizimos" description="Leitura consolidada das entradas principais.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                  Ofertas base
                </p>
                {filteredOffers.map((offer) => {
                  const treasurer = treasurerById.get(offer.id_treasurer);
                  const member = treasurer ? memberById.get(treasurer.id_member) : undefined;

                  return (
                    <div key={offer.id} className="rounded-lg border border-line bg-stone p-4">
                      <p className="font-semibold text-ink">{formatCurrency(offer.value)}</p>
                      <p className="mt-1 text-sm text-ink/62">
                        {member ? member.name : `Tesouraria #${offer.id_treasurer}`}
                      </p>
                      {canEditFinancialData ? (
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <Button
                            variant="secondary"
                            className="w-full sm:w-auto"
                            onClick={() => loadOfferEditor(offer)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full text-ember hover:bg-ember/8 hover:text-ember sm:w-auto"
                            onClick={() => void handleDeleteOffer(offer)}
                          >
                            Excluir
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                <DashboardStateNotice
                  empty={!isLoadingFinanceData && !financeDataError && !filteredOffers.length}
                  emptyLabel="Nenhuma oferta base encontrada com os filtros atuais."
                />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                  Dizimos
                </p>
                {filteredTithes.map((tithe) => (
                  <div key={tithe.id} className="rounded-lg border border-line bg-stone p-4">
                    <p className="font-semibold text-ink">
                      {tithe.specialOffer?.offer?.value
                        ? formatCurrency(tithe.specialOffer.offer.value)
                        : `Mes ${tithe.month}/${tithe.year}`}
                    </p>
                    <p className="mt-1 text-sm text-ink/62">
                      {tithe.specialOffer?.reason ?? "Dizimo sem detalhe"} • {tithe.month}/{tithe.year}
                    </p>
                    {canEditFinancialData ? (
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Button
                          variant="secondary"
                          className="w-full sm:w-auto"
                          onClick={() => loadTitheEditor(tithe)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-ember hover:bg-ember/8 hover:text-ember sm:w-auto"
                          onClick={() => void handleDeleteTithe(tithe)}
                        >
                          Excluir
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
                <DashboardStateNotice
                  empty={!isLoadingFinanceData && !financeDataError && !filteredTithes.length}
                  emptyLabel="Nenhum dizimo encontrado com os filtros atuais."
                />
              </div>
            </div>
          </Panel>

          <Panel
            title="Ofertas especiais"
            description="Historico dos registros especiais ja relacionados a membro, igreja e oferta."
          >
            <div className="space-y-3">
              {filteredSpecialOffers.map((specialOffer) => {
                const member = memberById.get(specialOffer.id_member);
                const church = churchById.get(specialOffer.id_church);
                const offer = offerById.get(specialOffer.id_offer);

                return (
                  <div key={specialOffer.id} className="rounded-lg border border-line bg-stone p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <p className="font-semibold text-ink">{specialOffer.reason}</p>
                      <span className="text-sm font-semibold text-ink">
                        {offer ? formatCurrency(offer.value) : "Valor nao vinculado"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink/62">
                      {getChurchLabel(church)} • {member?.name ?? `Membro #${specialOffer.id_member}`} • {formatDate(specialOffer.date)}
                    </p>
                    {canEditFinancialData ? (
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Button
                          variant="secondary"
                          className="w-full sm:w-auto"
                          onClick={() => loadSpecialOfferEditor(specialOffer)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-ember hover:bg-ember/8 hover:text-ember sm:w-auto"
                          onClick={() => void handleDeleteSpecialOffer(specialOffer)}
                        >
                          Excluir
                        </Button>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <DashboardStateNotice
                empty={!isLoadingFinanceData && !financeDataError && !filteredSpecialOffers.length}
                emptyLabel="Nenhuma oferta especial encontrada com os filtros atuais."
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          {canEditFinancialData ? (
            <>
              <Panel
                title="Central financeira"
                description="Tesouraria, despesas, ofertas e dizimos."
              >
                <div className="space-y-5">
                  <SegmentedTabs
                    value={workflowTab}
                    onChange={setWorkflowTab}
                    options={workflowOptions}
                  />

                  {workflowTab === "treasurer" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                          <PlusIcon className="h-4 w-4" />
                          Nova tesouraria
                        </p>
                        <h4 className="font-display text-2xl text-ink">
                          Vincular um membro ao ciclo financeiro
                        </h4>
                      </div>

                      <form className="space-y-4" onSubmit={onAssignTreasurer}>
                        <Select
                          label="Membro"
                          error={treasurerForm.formState.errors.id_member?.message}
                          {...treasurerForm.register("id_member")}
                        >
                          <option value="">Selecione</option>
                          {treasurerMemberOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>

                        <FormNotice
                          error={treasurerFeedback.error}
                          success={treasurerFeedback.success}
                        />

                        <Button type="submit" disabled={isAssigningTreasurer}>
                          {isAssigningTreasurer ? "Salvando..." : "Ativar tesouraria"}
                        </Button>
                      </form>
                    </div>
                  ) : null}

                  {workflowTab === "costs" ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                          <FinanceIcon className="h-4 w-4" />
                          Despesas
                        </p>
                        <h4 className="font-display text-2xl text-ink">
                          Lancar e corrigir saidas financeiras
                        </h4>
                      </div>

                      <form className="space-y-4" onSubmit={onCreateCost}>
                        <Select
                          label="Igreja"
                          error={costForm.formState.errors.id_church?.message}
                          {...costForm.register("id_church")}
                        >
                          <option value="">Selecione</option>
                          {churchOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        <Input
                          label="Descricao"
                          error={costForm.formState.errors.description?.message}
                          {...costForm.register("description")}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            label="Valor"
                            error={costForm.formState.errors.value?.message}
                            {...costForm.register("value")}
                          />
                          <Input
                            label="Data"
                            type="date"
                            error={costForm.formState.errors.date?.message}
                            {...costForm.register("date")}
                          />
                        </div>

                        <FormNotice error={costFeedback.error} success={costFeedback.success} />

                        <Button type="submit" disabled={isSubmittingCost}>
                          {isSubmittingCost ? "Salvando..." : "Registrar despesa"}
                        </Button>
                      </form>

                      {selectedCost ? (
                        <div className="rounded-lg border border-line bg-stone/60 p-4">
                          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                            <EditIcon className="h-4 w-4" />
                            Edicao ativa
                          </p>
                          <form className="mt-4 space-y-4" onSubmit={onUpdateCost}>
                            <Input
                              label="Descricao"
                              error={costEditForm.formState.errors.description?.message}
                              {...costEditForm.register("description")}
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Input
                                label="Valor"
                                error={costEditForm.formState.errors.value?.message}
                                {...costEditForm.register("value")}
                              />
                              <Input
                                label="Data"
                                type="date"
                                error={costEditForm.formState.errors.date?.message}
                                {...costEditForm.register("date")}
                              />
                            </div>

                            <FormNotice
                              error={costEditFeedback.error}
                              success={costEditFeedback.success}
                            />

                            <div className="flex flex-wrap gap-3">
                              <Button type="submit" disabled={isUpdatingCost}>
                                {isUpdatingCost ? "Salvando..." : "Salvar despesa"}
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  setSelectedCostId(null);
                                  setCostEditFeedback({ error: null, success: null });
                                }}
                              >
                                Fechar edicao
                              </Button>
                            </div>
                          </form>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {workflowTab === "offers" ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                          <LinkIcon className="h-4 w-4" />
                          Ofertas
                        </p>
                        <h4 className="font-display text-2xl text-ink">
                          Oferta base e oferta especial no mesmo pacote
                        </h4>
                      </div>

                      <form className="space-y-4" onSubmit={onCreateOffer}>
                        <Select
                          label="Tesouraria"
                          error={offerForm.formState.errors.id_treasurer?.message}
                          {...offerForm.register("id_treasurer")}
                        >
                          <option value="">Selecione</option>
                          {offerTreasurerOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        <Input
                          label="Valor"
                          error={offerForm.formState.errors.value?.message}
                          {...offerForm.register("value")}
                        />

                        <FormNotice error={offerFeedback.error} success={offerFeedback.success} />

                        <Button type="submit" disabled={isSubmittingOffer}>
                          {isSubmittingOffer ? "Salvando..." : "Registrar oferta"}
                        </Button>
                      </form>

                      <div className="rounded-lg border border-line bg-stone/60 p-4">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                          <PlusIcon className="h-4 w-4" />
                          Oferta especial
                        </p>
                        <form className="mt-4 space-y-4" onSubmit={onCreateSpecialOffer}>
                          <Select
                            label="Igreja"
                            error={specialOfferForm.formState.errors.id_church?.message}
                            {...specialOfferForm.register("id_church")}
                          >
                            <option value="">Selecione</option>
                            {churchOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Select>
                          <Select
                            label="Membro responsavel"
                            error={specialOfferForm.formState.errors.id_member?.message}
                            {...specialOfferForm.register("id_member")}
                          >
                            <option value="">Selecione</option>
                            {specialOfferMembers.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Select>
                          <Select
                            label="Tesouraria"
                            error={specialOfferForm.formState.errors.id_treasurer?.message}
                            {...specialOfferForm.register("id_treasurer")}
                          >
                            <option value="">Selecione</option>
                            {specialOfferTreasurers.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Select>
                          <Input
                            label="Motivo"
                            error={specialOfferForm.formState.errors.reason?.message}
                            {...specialOfferForm.register("reason")}
                          />
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                              label="Valor"
                              error={specialOfferForm.formState.errors.value?.message}
                              {...specialOfferForm.register("value")}
                            />
                            <Input
                              label="Data"
                              type="date"
                              error={specialOfferForm.formState.errors.date?.message}
                              {...specialOfferForm.register("date")}
                            />
                          </div>

                          <FormNotice
                            error={specialOfferFeedback.error}
                            success={specialOfferFeedback.success}
                          />

                          <Button type="submit" disabled={isSubmittingSpecialOffer}>
                            {isSubmittingSpecialOffer ? "Salvando..." : "Registrar oferta especial"}
                          </Button>
                        </form>
                      </div>

                      {selectedOffer ? (
                        <div className="rounded-lg border border-line bg-stone/60 p-4">
                          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                            <EditIcon className="h-4 w-4" />
                            Editar oferta base
                          </p>
                          <form className="mt-4 space-y-4" onSubmit={onUpdateOffer}>
                            <Select
                              label="Tesouraria"
                              error={offerEditForm.formState.errors.id_treasurer?.message}
                              {...offerEditForm.register("id_treasurer")}
                            >
                              <option value="">Selecione</option>
                              {offerTreasurerOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <Input
                              label="Valor"
                              error={offerEditForm.formState.errors.value?.message}
                              {...offerEditForm.register("value")}
                            />

                            <FormNotice
                              error={offerEditFeedback.error}
                              success={offerEditFeedback.success}
                            />

                            <div className="flex flex-wrap gap-3">
                              <Button type="submit" disabled={isUpdatingOffer}>
                                {isUpdatingOffer ? "Salvando..." : "Salvar oferta"}
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  setSelectedOfferId(null);
                                  setOfferEditFeedback({ error: null, success: null });
                                }}
                              >
                                Fechar edicao
                              </Button>
                            </div>
                          </form>
                        </div>
                      ) : null}

                      {selectedSpecialOffer ? (
                        <div className="rounded-lg border border-line bg-stone/60 p-4">
                          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                            <EditIcon className="h-4 w-4" />
                            Editar oferta especial
                          </p>
                          <form className="mt-4 space-y-4" onSubmit={onUpdateSpecialOffer}>
                            <Select
                              label="Igreja"
                              error={specialOfferEditForm.formState.errors.id_church?.message}
                              {...specialOfferEditForm.register("id_church")}
                            >
                              <option value="">Selecione</option>
                              {churchOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <Select
                              label="Membro responsavel"
                              error={specialOfferEditForm.formState.errors.id_member?.message}
                              {...specialOfferEditForm.register("id_member")}
                            >
                              <option value="">Selecione</option>
                              {specialOfferEditMembers.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <Select
                              label="Tesouraria"
                              error={specialOfferEditForm.formState.errors.id_treasurer?.message}
                              {...specialOfferEditForm.register("id_treasurer")}
                            >
                              <option value="">Selecione</option>
                              {specialOfferEditTreasurers.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <Input
                              label="Motivo"
                              error={specialOfferEditForm.formState.errors.reason?.message}
                              {...specialOfferEditForm.register("reason")}
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Input
                                label="Valor"
                                error={specialOfferEditForm.formState.errors.value?.message}
                                {...specialOfferEditForm.register("value")}
                              />
                              <Input
                                label="Data"
                                type="date"
                                error={specialOfferEditForm.formState.errors.date?.message}
                                {...specialOfferEditForm.register("date")}
                              />
                            </div>

                            <FormNotice
                              error={specialOfferEditFeedback.error}
                              success={specialOfferEditFeedback.success}
                            />

                            <div className="flex flex-wrap gap-3">
                              <Button type="submit" disabled={isUpdatingSpecialOffer}>
                                {isUpdatingSpecialOffer ? "Salvando..." : "Salvar oferta especial"}
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  setSelectedSpecialOfferId(null);
                                  setSpecialOfferEditFeedback({ error: null, success: null });
                                }}
                              >
                                Fechar edicao
                              </Button>
                            </div>
                          </form>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {workflowTab === "tithes" ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                          <WorkflowIcon className="h-4 w-4" />
                          Dizimos
                        </p>
                        <h4 className="font-display text-2xl text-ink">
                          Acompanhar e registrar o ciclo mensal
                        </h4>
                      </div>

                      <form className="space-y-4" onSubmit={onCreateTithe}>
                        <Select
                          label="Igreja"
                          error={titheForm.formState.errors.id_church?.message}
                          {...titheForm.register("id_church")}
                        >
                          <option value="">Selecione</option>
                          {churchOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        <Select
                          label="Membro responsavel"
                          error={titheForm.formState.errors.id_member?.message}
                          {...titheForm.register("id_member")}
                        >
                          <option value="">Selecione</option>
                          {titheMembers.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        <Select
                          label="Tesouraria"
                          error={titheForm.formState.errors.id_treasurer?.message}
                          {...titheForm.register("id_treasurer")}
                        >
                          <option value="">Selecione</option>
                          {titheTreasurers.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        <Input
                          label="Motivo"
                          error={titheForm.formState.errors.reason?.message}
                          {...titheForm.register("reason")}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            label="Valor"
                            error={titheForm.formState.errors.value?.message}
                            {...titheForm.register("value")}
                          />
                          <Input
                            label="Data"
                            type="date"
                            error={titheForm.formState.errors.date?.message}
                            {...titheForm.register("date")}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            label="Mes"
                            error={titheForm.formState.errors.month?.message}
                            {...titheForm.register("month")}
                          />
                          <Input
                            label="Ano"
                            error={titheForm.formState.errors.year?.message}
                            {...titheForm.register("year")}
                          />
                        </div>

                        <FormNotice error={titheFeedback.error} success={titheFeedback.success} />

                        <Button type="submit" disabled={isSubmittingTithe}>
                          {isSubmittingTithe ? "Salvando..." : "Registrar dizimo"}
                        </Button>
                      </form>

                      {selectedTithe ? (
                        <div className="rounded-lg border border-line bg-stone/60 p-4">
                          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                            <EditIcon className="h-4 w-4" />
                            Editar dizimo
                          </p>
                          <form className="mt-4 space-y-4" onSubmit={onUpdateTithe}>
                            <Select
                              label="Igreja"
                              error={titheEditForm.formState.errors.id_church?.message}
                              {...titheEditForm.register("id_church")}
                            >
                              <option value="">Selecione</option>
                              {churchOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <Select
                              label="Membro responsavel"
                              error={titheEditForm.formState.errors.id_member?.message}
                              {...titheEditForm.register("id_member")}
                            >
                              <option value="">Selecione</option>
                              {titheEditMembers.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <Select
                              label="Tesouraria"
                              error={titheEditForm.formState.errors.id_treasurer?.message}
                              {...titheEditForm.register("id_treasurer")}
                            >
                              <option value="">Selecione</option>
                              {titheEditTreasurers.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <Input
                              label="Motivo"
                              error={titheEditForm.formState.errors.reason?.message}
                              {...titheEditForm.register("reason")}
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Input
                                label="Valor"
                                error={titheEditForm.formState.errors.value?.message}
                                {...titheEditForm.register("value")}
                              />
                              <Input
                                label="Data"
                                type="date"
                                error={titheEditForm.formState.errors.date?.message}
                                {...titheEditForm.register("date")}
                              />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Input
                                label="Mes"
                                error={titheEditForm.formState.errors.month?.message}
                                {...titheEditForm.register("month")}
                              />
                              <Input
                                label="Ano"
                                error={titheEditForm.formState.errors.year?.message}
                                {...titheEditForm.register("year")}
                              />
                            </div>

                            <FormNotice
                              error={titheEditFeedback.error}
                              success={titheEditFeedback.success}
                            />

                            <div className="flex flex-wrap gap-3">
                              <Button type="submit" disabled={isUpdatingTithe}>
                                {isUpdatingTithe ? "Salvando..." : "Salvar dizimo"}
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  setSelectedTitheId(null);
                                  setTitheEditFeedback({ error: null, success: null });
                                }}
                              >
                                Fechar edicao
                              </Button>
                            </div>
                          </form>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </Panel>

              <Panel title="Resumo" description="Filtros e listas do escopo atual.">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-moss">
                  <FilterIcon className="h-4 w-4" />
                  Filtros
                </p>
                <p className="mt-3 text-sm leading-7 text-ink/68">Use os filtros e selecione os registros desejados.</p>
              </Panel>
            </>
          ) : (
            <Panel
              title="Consulta financeira"
              description="Leitura financeira do escopo atual."
            >
              <p className="text-sm leading-7 text-ink/68">Acompanhe tesourarias, despesas, ofertas e dizimos.</p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
