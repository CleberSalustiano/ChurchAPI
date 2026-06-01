"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createCult,
  createCultOffer,
  createRecurringCultSeries,
  deleteCult,
  deleteCultOffer,
  fetchChurches,
  fetchCults,
  fetchTreasurers,
  updateCult,
  updateCultOffer,
  updateRecurringCultSeries,
} from "@/lib/api-client";
import { formatChurchScopeLabel } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type {
  Church,
  CultOfferRecord,
  CultRecord,
  MeResponse,
  TreasurerRecord,
} from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { DashboardStateNotice } from "./dashboard-state-notice";
import {
  CalendarIcon,
  CultIcon,
  EditIcon,
  FinanceIcon,
  LinkIcon,
  PlusIcon,
  WorkflowIcon,
} from "./portal-icons";

const cultSchema = z.object({
  id_church: z.string().min(1, "Selecione a igreja."),
  date: z.string().min(1, "Informe a data do culto."),
  theme: z.string().min(3, "Informe o tema do culto."),
});

const recurringCultSchema = cultSchema.extend({
  interval: z.coerce.number().int().min(1, "Use um intervalo semanal valido."),
  until: z.string().min(1, "Informe a data limite da recorrencia."),
});

const cultOfferSchema = z.object({
  id_treasurer: z.string().min(1, "Selecione a tesouraria responsavel."),
  value: z.coerce.number().positive("Informe um valor maior que zero."),
});

type CultValues = z.infer<typeof cultSchema>;
type RecurringCultValues = z.infer<typeof recurringCultSchema>;
type CultOfferValues = z.infer<typeof cultOfferSchema>;
type CultWorkspaceTab = "create" | "recurring" | "edit" | "offers";

function formatDate(dateString?: string | null) {
  if (!dateString) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(dateString));
}

function formatDateInput(dateString?: string | null) {
  if (!dateString) return "";

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().slice(0, 10);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatWeekday(dateString?: string | null) {
  if (!dateString) return "Agenda";

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
  }).format(new Date(dateString));
}

function getChurchLabel(church?: Church | null) {
  if (!church) return "Igreja nao localizada";

  if (!church.location) {
    return `Igreja #${church.id}`;
  }

  return `${church.type === "HEADQUARTER" ? "Sede" : "Congregacao"} • ${
    church.location.city
  }`;
}

function getQueryErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function normalizeDateKey(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfWeek(date: Date) {
  const clone = new Date(date);
  const weekday = clone.getDay();
  clone.setDate(clone.getDate() - weekday);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function addDays(date: Date, days: number) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + days);
  return clone;
}

function buildCalendarDays(monthDate: Date) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart);
  const days = [];

  for (let index = 0; index < 42; index += 1) {
    const currentDate = addDays(gridStart, index);
    days.push({
      date: currentDate,
      key: normalizeDateKey(currentDate.toISOString()),
      inCurrentMonth: currentDate >= monthStart && currentDate <= monthEnd,
    });
  }

  return days;
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

function CultCard({
  cult,
  church,
  canEdit,
  isBusy,
  isSelected,
  offerTotal,
  onEdit,
  onDelete,
  onOpenOffers,
}: {
  cult: CultRecord;
  church?: Church;
  canEdit: boolean;
  isBusy: boolean;
  isSelected: boolean;
  offerTotal: number;
  onEdit: () => void;
  onDelete: () => void;
  onOpenOffers: () => void;
}) {
  return (
    <article
      className={`rounded-lg border p-5 transition ${
        isSelected ? "border-brass bg-white" : "border-line bg-stone"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-ink/44">
            {formatWeekday(cult.date)}
          </p>
          <h4 className="font-display text-2xl text-ink">{cult.theme}</h4>
        </div>
        <span className="rounded-lg border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/64">
          {formatDate(cult.date)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-lg border border-line bg-white px-3 py-1 font-semibold uppercase tracking-[0.16em] text-ink/56">
          {getChurchLabel(church)}
        </span>
        {cult.recurrenceGroup ? (
          <span className="rounded-lg border border-brass/20 bg-brass/10 px-3 py-1 font-semibold uppercase tracking-[0.16em] text-brass">
            Serie semanal
          </span>
        ) : null}
      </div>

      <div className="mt-4 rounded-lg border border-line/80 bg-white px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
          Ofertas deste culto
        </p>
        <p className="mt-2 text-base font-semibold text-ink">
          {formatCurrency(offerTotal)}
        </p>
        <p className="mt-1 text-sm text-ink/58">
          {cult.CultOffer?.length ?? 0} lancamentos vinculados
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onOpenOffers}
        >
          Ver ofertas
        </Button>
        {canEdit ? (
          <>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={onEdit}
            >
              Editar
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-ember hover:bg-ember/8 hover:text-ember sm:w-auto"
              onClick={onDelete}
              disabled={isBusy}
            >
              {isBusy ? "Salvando..." : "Excluir"}
            </Button>
          </>
        ) : null}
      </div>
    </article>
  );
}

export function CultDashboard({ profile }: { profile: MeResponse }) {
  const { session } = useAuth();
  const [workflowTab, setWorkflowTab] = useState<CultWorkspaceTab>("create");
  const [selectedCultId, setSelectedCultId] = useState<number | null>(null);
  const [editingCultOfferId, setEditingCultOfferId] = useState<number | null>(null);
  const [filterChurchId, setFilterChurchId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [cultActionId, setCultActionId] = useState<number | null>(null);
  const [cultError, setCultError] = useState<string | null>(null);
  const [cultSuccess, setCultSuccess] = useState<string | null>(null);
  const [recurringError, setRecurringError] = useState<string | null>(null);
  const [recurringSuccess, setRecurringSuccess] = useState<string | null>(null);
  const [cultEditError, setCultEditError] = useState<string | null>(null);
  const [cultEditSuccess, setCultEditSuccess] = useState<string | null>(null);
  const [cultOfferError, setCultOfferError] = useState<string | null>(null);
  const [cultOfferSuccess, setCultOfferSuccess] = useState<string | null>(null);
  const [applySeriesUpdate, setApplySeriesUpdate] = useState(false);
  const [isSubmittingCult, startCultTransition] = useTransition();
  const [isSubmittingRecurringCult, startRecurringCultTransition] = useTransition();
  const [isUpdatingCult, startCultUpdateTransition] = useTransition();
  const [isDeletingCult, startCultDeleteTransition] = useTransition();
  const [isSavingCultOffer, startCultOfferTransition] = useTransition();
  const [isDeletingCultOffer, startCultOfferDeleteTransition] = useTransition();

  const canEditCultData = Boolean(profile.permissions?.canEditManagementData);
  const defaultChurchId = String(profile.access?.churchId ?? profile.member.id_church);

  const churchesQuery = useQuery({
    queryKey: ["cult-churches", session?.token],
    queryFn: () => fetchChurches(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const cultsQuery = useQuery({
    queryKey: ["cult-records", session?.token],
    queryFn: () => fetchCults(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const treasurersQuery = useQuery({
    queryKey: ["cult-treasurers", session?.token],
    queryFn: () => fetchTreasurers(session!.token),
    enabled: Boolean(session?.token && canEditCultData),
  });

  const cultForm = useForm<CultValues>({
    resolver: zodResolver(cultSchema),
    defaultValues: {
      id_church: defaultChurchId,
      date: "",
      theme: "",
    },
  });

  const recurringCultForm = useForm<RecurringCultValues>({
    resolver: zodResolver(recurringCultSchema),
    defaultValues: {
      id_church: defaultChurchId,
      date: "",
      theme: "",
      interval: 1,
      until: "",
    },
  });

  const cultEditForm = useForm<CultValues>({
    resolver: zodResolver(cultSchema),
    defaultValues: {
      id_church: defaultChurchId,
      date: "",
      theme: "",
    },
  });

  const cultOfferForm = useForm<CultOfferValues>({
    resolver: zodResolver(cultOfferSchema),
    defaultValues: {
      id_treasurer: "",
      value: 0,
    },
  });

  const churches = useMemo(() => churchesQuery.data?.churches ?? [], [churchesQuery.data?.churches]);
  const cults = useMemo(() => cultsQuery.data?.cults ?? [], [cultsQuery.data?.cults]);
  const treasurers = useMemo(
    () => treasurersQuery.data?.treasurers ?? [],
    [treasurersQuery.data?.treasurers]
  );

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

  const filteredCults = useMemo(() => {
    return [...cults]
      .filter((cult) => {
        if (filterChurchId !== "all" && String(cult.id_church) !== filterChurchId) {
          return false;
        }

        if (!searchTerm.trim()) {
          return true;
        }

        return cult.theme.toLowerCase().includes(searchTerm.trim().toLowerCase());
      })
      .sort((left, right) => {
        return new Date(left.date).getTime() - new Date(right.date).getTime();
      });
  }, [cults, filterChurchId, searchTerm]);

  const selectedCult = useMemo(
    () => cults.find((cult) => cult.id === selectedCultId) ?? null,
    [cults, selectedCultId]
  );

  const selectedCultOffers = useMemo(
    () => selectedCult?.CultOffer ?? [],
    [selectedCult]
  );

  const filteredTreasurers = useMemo(() => {
    const targetChurchId = selectedCult?.id_church ?? Number(defaultChurchId);
    return treasurers.filter((treasurer) => {
      if (treasurer.member?.id_church) {
        return treasurer.member.id_church === targetChurchId;
      }

      return profile.access?.scope === "CHURCH";
    });
  }, [defaultChurchId, profile.access?.scope, selectedCult?.id_church, treasurers]);

  const nextCult = useMemo(() => {
    return [...cults]
      .filter((cult) => new Date(cult.date).getTime() >= Date.now())
      .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())[0];
  }, [cults]);

  const recurringCultCount = useMemo(
    () => cults.filter((cult) => cult.recurrenceGroup).length,
    [cults]
  );

  const totalCultOfferValue = useMemo(() => {
    return cults.reduce((sum, cult) => {
      const cultTotal =
        cult.CultOffer?.reduce(
          (partial, item) => partial + (item.offer?.value ?? 0),
          0
        ) ?? 0;
      return sum + cultTotal;
    }, 0);
  }, [cults]);

  const cultsByDate = useMemo(() => {
    const map = new Map<string, CultRecord[]>();

    for (const cult of filteredCults) {
      const key = normalizeDateKey(cult.date);
      const currentItems = map.get(key) ?? [];
      currentItems.push(cult);
      map.set(key, currentItems);
    }

    return map;
  }, [filteredCults]);

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth]
  );

  const isLoadingCultData =
    (churchesQuery.isLoading && !churches.length) ||
    (cultsQuery.isLoading && !cults.length);
  const cultDataError =
    churchesQuery.error || cultsQuery.error || treasurersQuery.error
      ? getQueryErrorMessage(
          churchesQuery.error ?? cultsQuery.error ?? treasurersQuery.error,
          "Nao foi possivel carregar a central de cultos deste escopo."
        )
      : null;

  async function refreshCultData() {
    await Promise.all([
      churchesQuery.refetch(),
      cultsQuery.refetch(),
      canEditCultData ? treasurersQuery.refetch() : Promise.resolve(),
    ]);
  }

  function resetCultOfferForm() {
    setEditingCultOfferId(null);
    cultOfferForm.reset({
      id_treasurer: filteredTreasurers[0]?.id
        ? String(filteredTreasurers[0].id)
        : "",
      value: 0,
    });
  }

  function loadCultEditor(cult: CultRecord) {
    setWorkflowTab("edit");
    setSelectedCultId(cult.id);
    setApplySeriesUpdate(false);
    setCultEditError(null);
    setCultEditSuccess(null);
    cultEditForm.reset({
      id_church: String(cult.id_church),
      date: formatDateInput(cult.date),
      theme: cult.theme,
    });
  }

  function openCultOffers(cult: CultRecord) {
    setSelectedCultId(cult.id);
    setWorkflowTab("offers");
    setCultOfferError(null);
    setCultOfferSuccess(null);
    resetCultOfferForm();
  }

  function loadCultOfferEditor(cultOffer: CultOfferRecord) {
    setEditingCultOfferId(cultOffer.id);
    cultOfferForm.reset({
      id_treasurer: cultOffer.offer?.id_treasurer
        ? String(cultOffer.offer.id_treasurer)
        : "",
      value: cultOffer.offer?.value ?? 0,
    });
  }

  const onCreateCult = cultForm.handleSubmit((values) => {
    if (!session?.token) return;

    setCultError(null);
    setCultSuccess(null);

    startCultTransition(async () => {
      try {
        const response = await createCult(session.token, {
          id_church: Number(values.id_church),
          date: values.date,
          theme: values.theme,
        });

        cultForm.reset({
          id_church: defaultChurchId,
          date: "",
          theme: "",
        });
        setSelectedCultId(response.cult.id);
        await refreshCultData();
        setCultSuccess("Culto cadastrado com sucesso.");
      } catch (error) {
        setCultError(
          error instanceof Error ? error.message : "Nao foi possivel cadastrar o culto."
        );
      }
    });
  });

  const onCreateRecurringCult = recurringCultForm.handleSubmit((values) => {
    if (!session?.token) return;

    setRecurringError(null);
    setRecurringSuccess(null);

    startRecurringCultTransition(async () => {
      try {
        await createRecurringCultSeries(session.token, {
          id_church: Number(values.id_church),
          date: values.date,
          theme: values.theme,
          recurrence: {
            interval: values.interval,
            until: values.until,
          },
        });

        recurringCultForm.reset({
          id_church: defaultChurchId,
          date: "",
          theme: "",
          interval: 1,
          until: "",
        });
        await refreshCultData();
        setRecurringSuccess("Serie recorrente criada com sucesso.");
      } catch (error) {
        setRecurringError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel criar a serie recorrente."
        );
      }
    });
  });

  const onUpdateCult = cultEditForm.handleSubmit((values) => {
    if (!session?.token || !selectedCult) return;

    setCultEditError(null);
    setCultEditSuccess(null);

    startCultUpdateTransition(async () => {
      try {
        await updateCult(session.token, selectedCult.id, {
          id_church: Number(values.id_church),
          date: values.date,
          theme: values.theme,
        });

        if (applySeriesUpdate && selectedCult.recurrenceGroup) {
          await updateRecurringCultSeries(session.token, selectedCult.id, {
            id_church: Number(values.id_church),
            theme: values.theme,
          });
        }

        await refreshCultData();
        setCultEditSuccess(
          applySeriesUpdate && selectedCult.recurrenceGroup
            ? "Culto atualizado e serie futura sincronizada."
            : "Culto atualizado com sucesso."
        );
      } catch (error) {
        setCultEditError(
          error instanceof Error ? error.message : "Nao foi possivel atualizar o culto."
        );
      }
    });
  });

  const onSubmitCultOffer = cultOfferForm.handleSubmit((values) => {
    if (!session?.token || !selectedCult) return;

    setCultOfferError(null);
    setCultOfferSuccess(null);

    startCultOfferTransition(async () => {
      try {
        if (editingCultOfferId) {
          await updateCultOffer(session.token, selectedCult.id, editingCultOfferId, {
            id_treasurer: Number(values.id_treasurer),
            value: values.value,
          });
          setCultOfferSuccess("Oferta do culto atualizada com sucesso.");
        } else {
          await createCultOffer(session.token, selectedCult.id, {
            id_treasurer: Number(values.id_treasurer),
            value: values.value,
          });
          setCultOfferSuccess("Oferta do culto registrada com sucesso.");
        }

        resetCultOfferForm();
        await refreshCultData();
      } catch (error) {
        setCultOfferError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel salvar a oferta deste culto."
        );
      }
    });
  });

  function handleDeleteCult(cult: CultRecord) {
    if (!session?.token) return;

    setCultActionId(cult.id);
    setCultEditError(null);
    setCultEditSuccess(null);
    setCultError(null);
    setCultSuccess(null);

    startCultDeleteTransition(async () => {
      try {
        await deleteCult(session.token, cult.id);

        if (selectedCultId === cult.id) {
          setSelectedCultId(null);
          setWorkflowTab("create");
          cultEditForm.reset({
            id_church: defaultChurchId,
            date: "",
            theme: "",
          });
          resetCultOfferForm();
        }

        await refreshCultData();
        setCultSuccess("Culto excluido com sucesso.");
      } catch (error) {
        setCultError(
          error instanceof Error ? error.message : "Nao foi possivel excluir o culto."
        );
      } finally {
        setCultActionId(null);
      }
    });
  }

  function handleDeleteCultOffer(cultOfferId: number) {
    if (!session?.token || !selectedCult) return;

    setCultOfferError(null);
    setCultOfferSuccess(null);

    startCultOfferDeleteTransition(async () => {
      try {
        await deleteCultOffer(session.token, selectedCult.id, cultOfferId);
        resetCultOfferForm();
        await refreshCultData();
        setCultOfferSuccess("Oferta do culto inativada com sucesso.");
      } catch (error) {
        setCultOfferError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel inativar a oferta do culto."
        );
      }
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
              Cultos, calendario e ofertas
            </p>
            <h3 className="font-display text-2xl text-ink sm:text-3xl">
              Cultos
            </h3>
          </div>

          <div className="rounded-lg border border-line bg-stone px-4 py-3 text-sm">
            <p className="text-ink/48">Escopo atual</p>
            <p className="mt-1 font-semibold text-ink">
              {formatChurchScopeLabel(profile.access?.scope)}
            </p>
          </div>
        </div>
      </div>

      <DashboardStateNotice
        loading={isLoadingCultData}
        error={cultDataError}
        loadingLabel="Carregando central de cultos..."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Cultos visiveis
          </p>
          <p className="mt-4 font-display text-4xl text-ink">{cults.length}</p>
        </div>
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Series recorrentes
          </p>
          <p className="mt-4 font-display text-4xl text-ink">
            {recurringCultCount}
          </p>
        </div>
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Proximo culto
          </p>
          <p className="mt-4 font-display text-2xl text-ink">
            {nextCult ? formatDate(nextCult.date) : "Sem agenda futura"}
          </p>
        </div>
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Ofertas em cultos
          </p>
          <p className="mt-4 font-display text-2xl text-ink">
            {formatCurrency(totalCultOfferValue)}
          </p>
        </div>
      </section>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.15fr)_400px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                  Calendario de cultos
                </p>
                <h4 className="mt-2 font-display text-2xl text-ink">
                  Visao mensal
                </h4>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setVisibleMonth(
                      (current) =>
                        new Date(current.getFullYear(), current.getMonth() - 1, 1)
                    )
                  }
                >
                  Mes anterior
                </Button>
                <span className="text-sm font-semibold text-ink">
                  {new Intl.DateTimeFormat("pt-BR", {
                    month: "long",
                    year: "numeric",
                  }).format(visibleMonth)}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setVisibleMonth(
                      (current) =>
                        new Date(current.getFullYear(), current.getMonth() + 1, 1)
                    )
                  }
                >
                  Proximo mes
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto pb-2">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/46">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((label) => (
                    <div key={label}>{label}</div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => {
                    const dayCults = cultsByDate.get(day.key) ?? [];
                    return (
                      <div
                        key={day.key}
                        className={`min-h-[124px] rounded-lg border p-2 ${
                          day.inCurrentMonth
                            ? "border-line bg-stone"
                            : "border-line/60 bg-white/55 text-ink/38"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-ink">
                            {day.date.getDate()}
                          </span>
                          {dayCults.length ? (
                            <span className="rounded-lg bg-brass/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brass">
                              {dayCults.length}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-2 space-y-2">
                          {dayCults.slice(0, 2).map((cult) => (
                            <button
                              key={cult.id}
                              type="button"
                              className="w-full rounded-lg border border-white bg-white px-2 py-2 text-left text-[11px] font-semibold leading-5 text-ink transition hover:border-brass"
                              onClick={() => {
                                setSelectedCultId(cult.id);
                                setWorkflowTab("edit");
                                loadCultEditor(cult);
                              }}
                            >
                              {cult.theme}
                            </button>
                          ))}
                          {dayCults.length > 2 ? (
                            <p className="text-[11px] text-ink/52">
                              +{dayCults.length - 2} cultos
                            </p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                  Agenda detalhada
                </p>
                <h4 className="mt-2 font-display text-2xl text-ink">
                  Consulta por igreja, tema e ofertas vinculadas
                </h4>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[420px]">
                <Select
                  label="Filtrar por igreja"
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

                <Input
                  label="Buscar por tema"
                  placeholder="Ex.: ensino, ceia, jovens"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {filteredCults.map((cult) => {
                const offerTotal =
                  cult.CultOffer?.reduce(
                    (sum, item) => sum + (item.offer?.value ?? 0),
                    0
                  ) ?? 0;

                return (
                  <CultCard
                    key={cult.id}
                    cult={cult}
                    church={churches.find((church) => church.id === cult.id_church)}
                    canEdit={canEditCultData}
                    isBusy={isDeletingCult && cultActionId === cult.id}
                    isSelected={selectedCultId === cult.id}
                    offerTotal={offerTotal}
                    onEdit={() => loadCultEditor(cult)}
                    onDelete={() => handleDeleteCult(cult)}
                    onOpenOffers={() => openCultOffers(cult)}
                  />
                );
              })}

              <DashboardStateNotice
                empty={!isLoadingCultData && !cultDataError && !filteredCults.length}
                emptyLabel="Nenhum culto encontrado para o filtro atual."
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {canEditCultData ? (
            <section className="space-y-6 rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                  <WorkflowIcon className="h-4 w-4" />
                  Central de trabalho
                </p>
                <h4 className="font-display text-2xl text-ink">
                  Agenda, serie e ofertas no mesmo pacote
                </h4>
              </div>

              <SegmentedTabs
                value={workflowTab}
                onChange={setWorkflowTab}
                options={[
                  { value: "create", label: "Novo culto", icon: PlusIcon },
                  {
                    value: "recurring",
                    label: "Serie semanal",
                    icon: CalendarIcon,
                  },
                  {
                    value: "edit",
                    label: "Editar",
                    icon: EditIcon,
                    disabled: !selectedCult,
                  },
                  {
                    value: "offers",
                    label: "Ofertas",
                    icon: FinanceIcon,
                    disabled: !selectedCult,
                  },
                ]}
              />

              {workflowTab === "create" ? (
                <form className="space-y-4" onSubmit={onCreateCult}>
                  <Select
                    label="Igreja"
                    disabled={profile.access?.scope === "CHURCH"}
                    error={cultForm.formState.errors.id_church?.message}
                    {...cultForm.register("id_church")}
                  >
                    <option value="">Selecione</option>
                    {churchOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Data"
                    type="date"
                    error={cultForm.formState.errors.date?.message}
                    {...cultForm.register("date")}
                  />
                  <Input
                    label="Tema"
                    placeholder="Ex.: Culto de ensino"
                    error={cultForm.formState.errors.theme?.message}
                    {...cultForm.register("theme")}
                  />

                  <FormNotice error={cultError} success={cultSuccess} />

                  <Button type="submit" disabled={isSubmittingCult}>
                    {isSubmittingCult ? "Salvando..." : "Cadastrar culto"}
                  </Button>
                </form>
              ) : null}

              {workflowTab === "recurring" ? (
                <form className="space-y-4" onSubmit={onCreateRecurringCult}>
                  <Select
                    label="Igreja"
                    disabled={profile.access?.scope === "CHURCH"}
                    error={recurringCultForm.formState.errors.id_church?.message}
                    {...recurringCultForm.register("id_church")}
                  >
                    <option value="">Selecione</option>
                    {churchOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Primeira data"
                    type="date"
                    error={recurringCultForm.formState.errors.date?.message}
                    {...recurringCultForm.register("date")}
                  />
                  <Input
                    label="Tema da serie"
                    error={recurringCultForm.formState.errors.theme?.message}
                    {...recurringCultForm.register("theme")}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Intervalo semanal"
                      type="number"
                      min="1"
                      error={recurringCultForm.formState.errors.interval?.message}
                      {...recurringCultForm.register("interval")}
                    />
                    <Input
                      label="Repetir ate"
                      type="date"
                      error={recurringCultForm.formState.errors.until?.message}
                      {...recurringCultForm.register("until")}
                    />
                  </div>

                  <FormNotice error={recurringError} success={recurringSuccess} />

                  <Button type="submit" disabled={isSubmittingRecurringCult}>
                    {isSubmittingRecurringCult
                      ? "Salvando..."
                      : "Criar serie recorrente"}
                  </Button>
                </form>
              ) : null}

              {workflowTab === "edit" && selectedCult ? (
                <form className="space-y-4" onSubmit={onUpdateCult}>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                    <LinkIcon className="h-4 w-4" />
                    {selectedCult.theme}
                  </p>

                  <Select
                    label="Igreja"
                    disabled={profile.access?.scope === "CHURCH"}
                    error={cultEditForm.formState.errors.id_church?.message}
                    {...cultEditForm.register("id_church")}
                  >
                    <option value="">Selecione</option>
                    {churchOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Data"
                    type="date"
                    error={cultEditForm.formState.errors.date?.message}
                    {...cultEditForm.register("date")}
                  />
                  <Input
                    label="Tema"
                    error={cultEditForm.formState.errors.theme?.message}
                    {...cultEditForm.register("theme")}
                  />

                  {selectedCult.recurrenceGroup ? (
                    <label className="flex items-start gap-3 rounded-lg border border-line bg-stone px-4 py-3 text-sm text-ink/72">
                      <input
                        type="checkbox"
                        checked={applySeriesUpdate}
                        onChange={(event) => setApplySeriesUpdate(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-[#2f5f93]"
                      />
                      <span>
                        Aplicar tema e igreja em toda a serie futura deste culto.
                        A data continua individual para o culto selecionado.
                      </span>
                    </label>
                  ) : null}

                  <FormNotice error={cultEditError} success={cultEditSuccess} />

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isUpdatingCult}>
                      {isUpdatingCult ? "Salvando..." : "Salvar alteracoes"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setSelectedCultId(null);
                        setWorkflowTab("create");
                        setCultEditError(null);
                        setCultEditSuccess(null);
                        setApplySeriesUpdate(false);
                      }}
                    >
                      Limpar selecao
                    </Button>
                  </div>
                </form>
              ) : null}

              {workflowTab === "offers" ? (
                selectedCult ? (
                  <div className="space-y-5">
                    <div className="rounded-lg border border-line bg-stone p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                        Culto selecionado
                      </p>
                      <p className="mt-2 font-display text-2xl text-ink">
                        {selectedCult.theme}
                      </p>
                      <p className="mt-2 text-sm text-ink/66">
                        {formatDate(selectedCult.date)} •{" "}
                        {getChurchLabel(
                          churches.find((church) => church.id === selectedCult.id_church)
                        )}
                      </p>
                    </div>

                    <form className="space-y-4" onSubmit={onSubmitCultOffer}>
                      <Select
                        label="Tesouraria responsavel"
                        error={cultOfferForm.formState.errors.id_treasurer?.message}
                        {...cultOfferForm.register("id_treasurer")}
                      >
                        <option value="">Selecione</option>
                        {filteredTreasurers.map((treasurer) => (
                          <option key={treasurer.id} value={String(treasurer.id)}>
                            #{treasurer.id} • {treasurer.member?.name ?? "Tesouraria ativa"}
                          </option>
                        ))}
                      </Select>

                      <Input
                        label="Valor da oferta"
                        type="number"
                        step="0.01"
                        error={cultOfferForm.formState.errors.value?.message}
                        {...cultOfferForm.register("value")}
                      />

                      <FormNotice error={cultOfferError} success={cultOfferSuccess} />

                      <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={isSavingCultOffer}>
                          {isSavingCultOffer
                            ? "Salvando..."
                            : editingCultOfferId
                            ? "Atualizar oferta"
                            : "Registrar oferta"}
                        </Button>
                        {editingCultOfferId ? (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={resetCultOfferForm}
                          >
                            Cancelar edicao
                          </Button>
                        ) : null}
                      </div>
                    </form>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                        Lancamentos deste culto
                      </p>

                      {selectedCultOffers.length ? (
                        selectedCultOffers.map((cultOffer) => (
                          <div
                            key={cultOffer.id}
                            className="rounded-lg border border-line bg-white px-4 py-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-ink">
                                  {formatCurrency(cultOffer.offer?.value ?? 0)}
                                </p>
                                <p className="mt-1 text-sm text-ink/58">
                                  Tesouraria #{cultOffer.offer?.id_treasurer ?? "-"}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => loadCultOfferEditor(cultOffer)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="text-ember hover:bg-ember/8 hover:text-ember"
                                  disabled={isDeletingCultOffer}
                                  onClick={() => handleDeleteCultOffer(cultOffer.id)}
                                >
                                  Inativar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <DashboardStateNotice
                          empty
                          emptyLabel="Nenhuma oferta registrada para este culto ainda."
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <DashboardStateNotice
                    empty
                    emptyLabel="Selecione um culto para registrar as ofertas dele."
                  />
                )
              ) : null}
            </section>
          ) : (
            <section className="rounded-lg border border-line bg-stone p-6">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-moss">
                <CultIcon className="h-4 w-4" />
                Consulta de cultos
              </p>
              <p className="mt-3 text-sm leading-7 text-ink/70">
                Seu perfil consegue acompanhar a agenda, o calendario e as ofertas
                ja registradas por culto. Alteracoes continuam reservadas aos
                perfis de edicao.
              </p>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}
