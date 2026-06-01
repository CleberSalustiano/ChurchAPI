"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createChurchWithManager,
  createManager,
  createMember,
  deactivateChurch,
  deleteChurch,
  deleteManager,
  deleteMember,
  fetchChurches,
  fetchManagers,
  fetchMembers,
  reactivateChurch,
  replaceManager,
  updateChurch,
  updateMember,
} from "@/lib/api-client";
import { formatAccessLabel, formatChurchScopeLabel } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { Church, ManagerRecord, MeResponse, MemberRecord } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { DashboardStateNotice } from "./dashboard-state-notice";
import {
  ChurchIcon,
  EditIcon,
  LeadershipIcon,
  LinkIcon,
  MembersIcon,
  PlusIcon,
  WorkflowIcon,
} from "./portal-icons";

const churchGovernanceSchema = z
  .object({
    date: z.string().min(1, "Informe a data de criacao."),
    street: z.string().min(2, "Informe a rua."),
    district: z.string().min(2, "Informe o bairro."),
    city: z.string().min(2, "Informe a cidade."),
    state: z.string().min(2, "Informe o estado."),
    country: z.string().min(2, "Informe o pais."),
    cep: z.string().min(8, "Informe o CEP."),
    type: z.enum(["HEADQUARTER", "BRANCH"]),
    manager_name: z.string().min(3, "Informe o nome do dirigente responsavel."),
    manager_birth_date: z.string().min(1, "Informe a data de nascimento."),
    manager_batism_date: z.string().min(1, "Informe a data de batismo."),
    manager_ecclesiasticalRole: z
      .string()
      .min(2, "Informe o cargo eclesiastico informativo."),
    manager_cpf: z.string().min(11, "Informe o CPF."),
    manager_rg: z.string().min(3, "Informe o RG."),
    manager_login: z.string().min(3, "Informe o login inicial."),
    manager_email: z.string().email("Informe um email valido."),
    manager_password: z.string().optional(),
  })
  .superRefine((values, context) => {
    const normalizedCpf = values.manager_cpf.replace(/\D/g, "");
    const normalizedPassword = values.manager_password?.trim();

    if (
      normalizedPassword &&
      normalizedPassword !== "1234" &&
      normalizedPassword !== normalizedCpf
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manager_password"],
        message: "A senha inicial deve ser 1234, o CPF, ou ficar vazia para usar o CPF.",
      });
    }
  });

const churchEditSchema = z.object({
  date: z.string().min(1, "Informe a data de criacao."),
  street: z.string().min(2, "Informe a rua."),
  district: z.string().min(2, "Informe o bairro."),
  city: z.string().min(2, "Informe a cidade."),
  state: z.string().min(2, "Informe o estado."),
  country: z.string().min(2, "Informe o pais."),
  cep: z.string().min(8, "Informe o CEP."),
});

const memberCreateSchema = z
  .object({
    id_church: z.string().min(1, "Selecione a igreja."),
    name: z.string().min(3, "Informe o nome completo."),
    birth_date: z.string().min(1, "Informe a data de nascimento."),
    batism_date: z.string().min(1, "Informe a data de batismo."),
    ecclesiasticalRole: z.string().min(2, "Informe o cargo eclesiastico informativo."),
    cpf: z.string().min(11, "Informe o CPF."),
    rg: z.string().min(3, "Informe o RG."),
    login: z.string().min(3, "Informe o login inicial."),
    email: z.string().email("Informe um email valido."),
    password: z.string().optional(),
  })
  .superRefine((values, context) => {
    const normalizedCpf = values.cpf.replace(/\D/g, "");
    const normalizedPassword = values.password?.trim();

    if (
      normalizedPassword &&
      normalizedPassword !== "1234" &&
      normalizedPassword !== normalizedCpf
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "A senha inicial deve ser 1234, o CPF, ou ficar vazia para usar o CPF.",
      });
    }
  });

const memberEditSchema = z.object({
  id_church: z.string().min(1, "Selecione a igreja."),
  name: z.string().min(3, "Informe o nome completo."),
  birth_date: z.string().min(1, "Informe a data de nascimento."),
  batism_date: z.string().min(1, "Informe a data de batismo."),
  ecclesiasticalRole: z.string().min(2, "Informe o cargo eclesiastico informativo."),
  cpf: z.string().min(11, "Informe o CPF."),
  rg: z.string().min(3, "Informe o RG."),
  email: z.string().email("Informe um email valido."),
});

const managerSchema = z.object({
  id_member: z.string().min(1, "Selecione o membro."),
  id_church: z.string().min(1, "Selecione a igreja."),
});

const managerReplaceSchema = z.object({
  id_member: z.string().min(1, "Selecione o novo dirigente."),
});

type ChurchGovernanceValues = z.infer<typeof churchGovernanceSchema>;
type ChurchEditValues = z.infer<typeof churchEditSchema>;
type MemberCreateValues = z.infer<typeof memberCreateSchema>;
type MemberEditValues = z.infer<typeof memberEditSchema>;
type ManagerValues = z.infer<typeof managerSchema>;
type ManagerReplaceValues = z.infer<typeof managerReplaceSchema>;
type ManagementWorkspaceTab = "churches" | "members" | "managers";

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

function formatDate(dateString?: string | null) {
  if (!dateString) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(dateString));
}

function formatDateInput(dateString?: string | null) {
  if (!dateString) return "";

  const trimmedValue = dateString.trim();
  const dateMatch = trimmedValue.match(/^(\d{4}-\d{2}-\d{2})/);

  if (dateMatch) {
    return dateMatch[1];
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function getChurchName(church: Church) {
  if (!church.location) {
    return `Igreja #${church.id}`;
  }

  return `${church.type === "HEADQUARTER" ? "Sede" : "Congregacao"} • ${
    church.location.city
  }`;
}

function getChurchSummary(church: Church) {
  if (!church.location) {
    return `Igreja #${church.id}`;
  }

  return `${church.location.street}, ${church.location.district} • ${church.location.city}/${church.location.state}`;
}

function managerMemberName(manager: ManagerRecord, members: MemberRecord[]) {
  return members.find((member) => member.id === manager.id_member)?.name || `Membro #${manager.id_member}`;
}

function managerChurchName(manager: ManagerRecord, churches: Church[]) {
  const church = churches.find((item) => item.id === manager.id_church);
  return church ? getChurchName(church) : `Igreja #${manager.id_church}`;
}

function getQueryErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function ManagementDashboard({ profile }: { profile: MeResponse }) {
  const { refreshProfile, session } = useAuth();
  const canManageChurches =
    profile.permissions?.canEditManagementData && profile.access?.scope === "GLOBAL";
  const canManageMembers = Boolean(profile.permissions?.canEditManagementData);
  const [isSubmittingChurch, startChurchTransition] = useTransition();
  const [isUpdatingChurch, startChurchUpdateTransition] = useTransition();
  const [isMutatingChurch, startChurchMutationTransition] = useTransition();
  const [isSubmittingMember, startMemberTransition] = useTransition();
  const [isUpdatingMember, startMemberUpdateTransition] = useTransition();
  const [isMutatingMember, startMemberMutationTransition] = useTransition();
  const [isSubmittingManager, startManagerTransition] = useTransition();
  const [isMutatingManager, startManagerMutationTransition] = useTransition();
  const [isReplacingManager, startManagerReplaceTransition] = useTransition();
  const [selectedChurchId, setSelectedChurchId] = useState<number | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null);
  const [churchActionId, setChurchActionId] = useState<number | null>(null);
  const [memberActionId, setMemberActionId] = useState<number | null>(null);
  const [managerActionId, setManagerActionId] = useState<number | null>(null);
  const [workflowTab, setWorkflowTab] = useState<ManagementWorkspaceTab>(
    canManageChurches ? "churches" : "members"
  );
  const [churchError, setChurchError] = useState<string | null>(null);
  const [churchSuccess, setChurchSuccess] = useState<string | null>(null);
  const [churchEditError, setChurchEditError] = useState<string | null>(null);
  const [churchEditSuccess, setChurchEditSuccess] = useState<string | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberSuccess, setMemberSuccess] = useState<string | null>(null);
  const [memberEditError, setMemberEditError] = useState<string | null>(null);
  const [memberEditSuccess, setMemberEditSuccess] = useState<string | null>(null);
  const [managerError, setManagerError] = useState<string | null>(null);
  const [managerSuccess, setManagerSuccess] = useState<string | null>(null);

  const churchesQuery = useQuery({
    queryKey: ["management-churches", session?.token],
    queryFn: () => fetchChurches(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const membersQuery = useQuery({
    queryKey: ["management-members", session?.token],
    queryFn: () => fetchMembers(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const managersQuery = useQuery({
    queryKey: ["management-managers", session?.token],
    queryFn: () => fetchManagers(session!.token),
    enabled: Boolean(session?.token && profile.permissions?.canViewManagementData),
  });

  const churchEditForm = useForm<ChurchEditValues>({
    resolver: zodResolver(churchEditSchema),
    defaultValues: {
      date: "",
      street: "",
      district: "",
      city: "",
      state: "",
      country: "Brasil",
      cep: "",
    },
  });

  const memberForm = useForm<MemberCreateValues>({
    resolver: zodResolver(memberCreateSchema),
    defaultValues: {
      id_church: String(profile.access?.churchId ?? profile.member.id_church),
      name: "",
      birth_date: "",
      batism_date: "",
      ecclesiasticalRole: "Membro",
      cpf: "",
      rg: "",
      login: "",
      email: "",
      password: "",
    },
  });

  const memberEditForm = useForm<MemberEditValues>({
    resolver: zodResolver(memberEditSchema),
    defaultValues: {
      id_church: String(profile.access?.churchId ?? profile.member.id_church),
      name: "",
      birth_date: "",
      batism_date: "",
      ecclesiasticalRole: "Membro",
      cpf: "",
      rg: "",
      email: "",
    },
  });

  const managerForm = useForm<ManagerValues>({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      id_member: "",
      id_church: String(profile.access?.churchId ?? profile.member.id_church),
    },
  });

  const churchForm = useForm<ChurchGovernanceValues>({
    resolver: zodResolver(churchGovernanceSchema),
    defaultValues: {
      date: "",
      street: "",
      district: "",
      city: "",
      state: "",
      country: "Brasil",
      cep: "",
      type: "BRANCH",
      manager_name: "",
      manager_birth_date: "",
      manager_batism_date: "",
      manager_ecclesiasticalRole: "Dirigente",
      manager_cpf: "",
      manager_rg: "",
      manager_login: "",
      manager_email: "",
      manager_password: "",
    },
  });

  const managerReplaceForm = useForm<ManagerReplaceValues>({
    resolver: zodResolver(managerReplaceSchema),
    defaultValues: {
      id_member: "",
    },
  });

  const churches = useMemo(
    () => churchesQuery.data?.churches ?? [],
    [churchesQuery.data?.churches]
  );
  const members = useMemo(
    () => membersQuery.data?.members ?? [],
    [membersQuery.data?.members]
  );
  const managers = useMemo(
    () => managersQuery.data?.managers ?? [],
    [managersQuery.data?.managers]
  );
  const selectableChurches = useMemo(
    () => churches.filter((church) => church.status !== "DELETED"),
    [churches]
  );
  const selectedChurch = useMemo(
    () => churches.find((church) => church.id === selectedChurchId) ?? null,
    [churches, selectedChurchId]
  );
  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );
  const selectedManager = useMemo(
    () => managers.find((manager) => manager.id === selectedManagerId) ?? null,
    [managers, selectedManagerId]
  );
  const watchedManagerChurchId = managerForm.watch("id_church");

  const memberOptions = useMemo(
    () =>
      members
        .filter((member) =>
          watchedManagerChurchId
            ? String(member.id_church) === watchedManagerChurchId
            : true
        )
        .map((member) => ({
        value: String(member.id),
        label: `${member.name} • Igreja #${member.id_church}`,
      })),
    [members, watchedManagerChurchId]
  );

  const churchOptions = useMemo(
    () =>
      selectableChurches.map((church) => ({
        value: String(church.id),
        label: `${getChurchName(church)} • #${church.id}`,
      })),
    [selectableChurches]
  );
  const replacementMemberOptions = useMemo(() => {
    if (!selectedManager) {
      return [];
    }

    return members
      .filter(
        (member) =>
          member.id_church === selectedManager.id_church &&
          member.id !== selectedManager.id_member
      )
      .map((member) => ({
        value: String(member.id),
        label: `${member.name} • CPF ${member.cpf}`,
      }));
  }, [members, selectedManager]);
  const isLoadingManagementData =
    (churchesQuery.isLoading && !churches.length) ||
    (membersQuery.isLoading && !members.length) ||
    (managersQuery.isLoading && !managers.length);
  const managementDataError =
    churchesQuery.error || membersQuery.error || managersQuery.error
      ? getQueryErrorMessage(
          churchesQuery.error ?? membersQuery.error ?? managersQuery.error,
          "Nao foi possivel carregar os dados administrativos deste escopo."
        )
      : null;

  function loadChurchEditor(church: Church) {
    setWorkflowTab("churches");
    setSelectedChurchId(church.id);
    setChurchEditError(null);
    setChurchEditSuccess(null);
    churchEditForm.reset({
      date: formatDateInput(church.creationDate),
      street: church.location?.street ?? "",
      district: church.location?.district ?? "",
      city: church.location?.city ?? "",
      state: church.location?.state ?? "",
      country: church.location?.country ?? "Brasil",
      cep: church.location?.cep ? String(church.location.cep) : "",
    });
  }

  function loadMemberEditor(member: MemberRecord) {
    setWorkflowTab("members");
    setSelectedMemberId(member.id);
    setMemberEditError(null);
    setMemberEditSuccess(null);
    memberEditForm.reset({
      id_church: String(member.id_church),
      name: member.name,
      birth_date: formatDateInput(member.birth_date),
      batism_date: formatDateInput(member.batism_date),
      ecclesiasticalRole: member.ecclesiasticalRole,
      cpf: member.cpf,
      rg: String(member.rg),
      email: member.email,
    });
  }

  function loadManagerReplacement(manager: ManagerRecord) {
    setWorkflowTab("managers");
    setSelectedManagerId(manager.id);
    setManagerError(null);
    setManagerSuccess(null);
    managerReplaceForm.reset({
      id_member: "",
    });
  }

  const onCreateChurch = churchForm.handleSubmit(async (values) => {
    if (!session) return;

    setChurchError(null);
    setChurchSuccess(null);

    startChurchTransition(async () => {
      try {
        await createChurchWithManager(session.token, {
          church: {
            date: values.date,
            street: values.street,
            district: values.district,
            city: values.city,
            state: values.state,
            country: values.country,
            cep: Number(values.cep.replace(/\D/g, "")),
            type: values.type,
          },
          manager: {
            name: values.manager_name,
            birth_date: values.manager_birth_date,
            batism_date: values.manager_batism_date,
            ecclesiasticalRole: values.manager_ecclesiasticalRole,
            cpf: values.manager_cpf.replace(/\D/g, ""),
            rg: Number(values.manager_rg),
            login: values.manager_login,
            email: values.manager_email,
            password: values.manager_password?.trim() || undefined,
          },
        });

        churchForm.reset({
          date: "",
          street: "",
          district: "",
          city: "",
          state: "",
          country: "Brasil",
          cep: "",
          type: "BRANCH",
          manager_name: "",
          manager_birth_date: "",
          manager_batism_date: "",
          manager_ecclesiasticalRole: "Dirigente",
          manager_cpf: "",
          manager_rg: "",
          manager_login: "",
          manager_email: "",
          manager_password: "",
        });

        await Promise.all([
          churchesQuery.refetch(),
          membersQuery.refetch(),
          managersQuery.refetch(),
          refreshProfile(),
        ]);
        setChurchSuccess("Igreja criada com dirigente inicial no mesmo fluxo.");
      } catch (error) {
        setChurchError(
          error instanceof Error ? error.message : "Nao foi possivel criar a igreja."
        );
      }
    });
  });

  const onUpdateChurch = churchEditForm.handleSubmit(async (values) => {
    if (!session || !selectedChurch) return;

    setChurchEditError(null);
    setChurchEditSuccess(null);

    startChurchUpdateTransition(async () => {
      try {
        await updateChurch(session.token, selectedChurch.id, {
          ...values,
          cep: Number(values.cep.replace(/\D/g, "")),
        });

        await churchesQuery.refetch();
        setChurchEditSuccess("Dados da igreja atualizados com sucesso.");
      } catch (error) {
        setChurchEditError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel atualizar a igreja."
        );
      }
    });
  });

  const onCreateMember = memberForm.handleSubmit(async (values) => {
    if (!session) return;

    setMemberError(null);
    setMemberSuccess(null);

    startMemberTransition(async () => {
      try {
        await createMember(session.token, {
          id_church: Number(values.id_church),
          name: values.name,
          birth_date: values.birth_date,
          batism_date: values.batism_date,
          ecclesiasticalRole: values.ecclesiasticalRole,
          cpf: values.cpf.replace(/\D/g, ""),
          rg: Number(values.rg),
          login: values.login,
          email: values.email,
          password: values.password?.trim() || undefined,
        });

        memberForm.reset({
          id_church:
            profile.access?.scope === "CHURCH"
              ? String(profile.access.churchId)
              : values.id_church,
          name: "",
          birth_date: "",
          batism_date: "",
          ecclesiasticalRole: "Membro",
          cpf: "",
          rg: "",
          login: "",
          email: "",
          password: "",
        });

        await Promise.all([membersQuery.refetch(), refreshProfile()]);
        setMemberSuccess("Membro criado com sucesso.");
      } catch (error) {
        setMemberError(
          error instanceof Error ? error.message : "Nao foi possivel criar o membro."
        );
      }
    });
  });

  const onUpdateMember = memberEditForm.handleSubmit(async (values) => {
    if (!session || !selectedMember) return;

    setMemberEditError(null);
    setMemberEditSuccess(null);

    startMemberUpdateTransition(async () => {
      try {
        await updateMember(session.token, selectedMember.id, {
          id_church: Number(values.id_church),
          name: values.name,
          birth_date: values.birth_date,
          batism_date: values.batism_date,
          ecclesiasticalRole: values.ecclesiasticalRole,
          cpf: values.cpf.replace(/\D/g, ""),
          rg: Number(values.rg),
          email: values.email,
        });

        await Promise.all([membersQuery.refetch(), refreshProfile()]);
        setMemberEditSuccess("Cadastro do membro atualizado com sucesso.");
      } catch (error) {
        setMemberEditError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel atualizar o membro."
        );
      }
    });
  });

  const onCreateManager = managerForm.handleSubmit(async (values) => {
    if (!session) return;

    setManagerError(null);
    setManagerSuccess(null);

    startManagerTransition(async () => {
      try {
        await createManager(session.token, {
          id_member: Number(values.id_member),
          id_church: Number(values.id_church),
        });

        managerForm.reset({
          id_member: "",
          id_church:
            profile.access?.scope === "CHURCH"
              ? String(profile.access.churchId)
              : values.id_church,
        });

        await managersQuery.refetch();
        setManagerSuccess("Designacao de dirigente criada com sucesso.");
      } catch (error) {
        setManagerError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel criar a designacao."
        );
      }
    });
  });

  const onReplaceManager = managerReplaceForm.handleSubmit(async (values) => {
    if (!session || !selectedManager) return;

    setManagerError(null);
    setManagerSuccess(null);

    startManagerReplaceTransition(async () => {
      try {
        await replaceManager(session.token, selectedManager.id, {
          id_member: Number(values.id_member),
        });

        managerReplaceForm.reset({
          id_member: "",
        });
        setSelectedManagerId(null);

        await Promise.all([managersQuery.refetch(), refreshProfile()]);
        setManagerSuccess("Dirigente substituido sem deixar a igreja descoberta.");
      } catch (error) {
        setManagerError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel substituir a designacao."
        );
      }
    });
  });

  const workflowOptions = useMemo(() => {
    const options: Array<{
      value: ManagementWorkspaceTab;
      label: string;
      icon: ComponentType<{ className?: string }>;
      disabled?: boolean;
    }> = [];

    if (canManageChurches) {
      options.push({
        value: "churches",
        label: "Igrejas",
        icon: ChurchIcon,
      });
    }

    if (canManageMembers) {
      options.push({
        value: "members",
        label: "Membros",
        icon: MembersIcon,
      });
      options.push({
        value: "managers",
        label: "Dirigencia",
        icon: LeadershipIcon,
      });
    }

    return options;
  }, [canManageChurches, canManageMembers]);

  function handleChurchStatusAction(
    church: Church,
    action: "deactivate" | "reactivate" | "delete"
  ) {
    if (!session) return;

    const messages = {
      deactivate: "Deseja desativar esta congregacao?",
      reactivate: "Deseja reativar esta congregacao?",
      delete: "Deseja excluir logicamente esta igreja?",
    };

    if (!window.confirm(messages[action])) {
      return;
    }

    setChurchEditError(null);
    setChurchEditSuccess(null);
    setChurchActionId(church.id);

    startChurchMutationTransition(async () => {
      try {
        if (action === "deactivate") {
          await deactivateChurch(session.token, church.id);
          setChurchEditSuccess("Congregacao desativada com sucesso.");
        } else if (action === "reactivate") {
          await reactivateChurch(session.token, church.id);
          setChurchEditSuccess("Congregacao reativada com sucesso.");
        } else {
          await deleteChurch(session.token, church.id);
          setChurchEditSuccess("Igreja excluida logicamente com sucesso.");
        }

        await churchesQuery.refetch();

        if (selectedChurchId === church.id) {
          setSelectedChurchId(null);
          churchEditForm.reset({
            date: "",
            street: "",
            district: "",
            city: "",
            state: "",
            country: "Brasil",
            cep: "",
          });
        }
      } catch (error) {
        setChurchEditError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel atualizar o estado da igreja."
        );
      } finally {
        setChurchActionId(null);
      }
    });
  }

  function handleDeleteMember(member: MemberRecord) {
    if (!session) return;

    if (!window.confirm(`Deseja inativar o membro ${member.name}?`)) {
      return;
    }

    setMemberEditError(null);
    setMemberEditSuccess(null);
    setMemberActionId(member.id);

    startMemberMutationTransition(async () => {
      try {
        await deleteMember(session.token, member.id);
        await Promise.all([membersQuery.refetch(), managersQuery.refetch(), refreshProfile()]);
        setMemberEditSuccess("Membro inativado com sucesso.");

        if (selectedMemberId === member.id) {
          setSelectedMemberId(null);
          memberEditForm.reset({
            id_church: String(profile.access?.churchId ?? profile.member.id_church),
            name: "",
            birth_date: "",
            batism_date: "",
            ecclesiasticalRole: "Membro",
            cpf: "",
            rg: "",
            email: "",
          });
        }
      } catch (error) {
        setMemberEditError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel inativar o membro."
        );
      } finally {
        setMemberActionId(null);
      }
    });
  }

  function handleDeleteManager(manager: ManagerRecord) {
    if (!session) return;

    if (
      !window.confirm(
        `Deseja encerrar a designacao de ${managerMemberName(manager, members)}?`
      )
    ) {
      return;
    }

    setManagerError(null);
    setManagerSuccess(null);
    setManagerActionId(manager.id);

    startManagerMutationTransition(async () => {
      try {
        await deleteManager(session.token, manager.id);
        await Promise.all([managersQuery.refetch(), refreshProfile()]);
        if (selectedManagerId === manager.id) {
          setSelectedManagerId(null);
          managerReplaceForm.reset({
            id_member: "",
          });
        }
        setManagerSuccess("Designacao encerrada com sucesso.");
      } catch (error) {
        setManagerError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel encerrar a designacao."
        );
      } finally {
        setManagerActionId(null);
      }
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
              Gestao integrada
            </p>
            <h3 className="font-display text-2xl text-ink sm:text-3xl">
              Gestao
            </h3>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="rounded-lg border border-line bg-stone px-4 py-3">
              <p className="text-ink/48">Nivel</p>
              <p className="mt-1 font-semibold text-ink">
                {formatAccessLabel(profile.access?.level)}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-stone px-4 py-3">
              <p className="text-ink/48">Escopo</p>
              <p className="mt-1 font-semibold text-ink">
                {formatChurchScopeLabel(profile.access?.scope)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DashboardStateNotice
        loading={isLoadingManagementData}
        error={managementDataError}
        loadingLabel="Carregando igrejas, membros e dirigentes visiveis..."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Igrejas visiveis
          </p>
          <p className="mt-4 font-display text-4xl text-ink">{churches.length}</p>
        </div>
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Membros visiveis
          </p>
          <p className="mt-4 font-display text-4xl text-ink">{members.length}</p>
        </div>
        <div className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Dirigentes ativos
          </p>
          <p className="mt-4 font-display text-4xl text-ink">{managers.length}</p>
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                  Igrejas
                </p>
                <h4 className="mt-2 font-display text-2xl text-ink">
                  Estrutura visivel neste escopo
                </h4>
              </div>
              <span className="text-sm text-ink/50">
                {churchesQuery.isFetching ? "Atualizando..." : "Ao vivo"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {churches.map((church) => (
                <article
                  key={church.id}
                  className={`rounded-lg border p-5 ${
                    selectedChurchId === church.id
                      ? "border-brass bg-white"
                      : "border-line bg-stone"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-ink/44">
                        {church.type === "HEADQUARTER" ? "Sede" : "Congregacao"}
                      </p>
                      <h5 className="mt-2 font-display text-2xl text-ink">
                        {getChurchName(church)}
                      </h5>
                    </div>
                    <span className="rounded-lg border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/64">
                      {church.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-ink/68">
                    {getChurchSummary(church)}
                  </p>
                  <p className="mt-3 text-sm text-ink/56">
                    Criada em {formatDate(church.creationDate)}
                  </p>

                  {canManageChurches ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-10 w-full sm:w-auto"
                        onClick={() => loadChurchEditor(church)}
                        disabled={church.status === "DELETED"}
                      >
                        Editar
                      </Button>

                      {church.type === "BRANCH" && church.status === "ACTIVE" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-10 w-full sm:w-auto"
                          onClick={() => handleChurchStatusAction(church, "deactivate")}
                          disabled={isMutatingChurch && churchActionId === church.id}
                        >
                          {isMutatingChurch && churchActionId === church.id
                            ? "Salvando..."
                            : "Desativar"}
                        </Button>
                      ) : null}

                      {church.type === "BRANCH" && church.status === "INACTIVE" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-10 w-full sm:w-auto"
                          onClick={() => handleChurchStatusAction(church, "reactivate")}
                          disabled={isMutatingChurch && churchActionId === church.id}
                        >
                          {isMutatingChurch && churchActionId === church.id
                            ? "Salvando..."
                            : "Reativar"}
                        </Button>
                      ) : null}

                      {church.status !== "DELETED" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-10 w-full sm:w-auto text-ember hover:bg-ember/8 hover:text-ember"
                          onClick={() => handleChurchStatusAction(church, "delete")}
                          disabled={isMutatingChurch && churchActionId === church.id}
                        >
                          {isMutatingChurch && churchActionId === church.id
                            ? "Salvando..."
                            : "Excluir"}
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}

              <DashboardStateNotice
                empty={!isLoadingManagementData && !managementDataError && !churches.length}
                emptyLabel="Nenhuma igreja visivel neste contexto."
              />
            </div>
          </section>

          <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                Membros
              </p>
              <h4 className="mt-2 font-display text-2xl text-ink">
                Lista atual de membros no escopo permitido
              </h4>
            </div>

            <div className="mt-6 rounded-lg border border-line bg-stone/40 p-3 md:overflow-hidden md:bg-transparent md:p-0">
              <div className="hidden grid-cols-[1.4fr_0.7fr_1fr_0.9fr_0.9fr] gap-3 bg-stone px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink/52 md:grid">
                <span>Membro</span>
                <span>Igreja</span>
                <span>Email</span>
                <span>Cargo</span>
                <span>Acoes</span>
              </div>

              <div className="space-y-3 md:space-y-0 md:divide-y md:divide-line md:bg-white">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className={`grid gap-4 rounded-lg border border-line bg-white p-4 md:grid-cols-[1.4fr_0.7fr_1fr_0.9fr_0.9fr] md:rounded-none md:border-0 md:bg-transparent md:px-5 md:py-4 ${
                      selectedMemberId === member.id ? "bg-brass/6" : ""
                    }`}
                  >
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/40 md:hidden">
                        Membro
                      </p>
                      <p className="font-semibold text-ink">{member.name}</p>
                      <p className="mt-1 text-sm text-ink/56">CPF {member.cpf}</p>
                    </div>
                    <div className="text-sm text-ink/70">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/40 md:hidden">
                        Igreja
                      </p>
                      #{member.id_church}
                    </div>
                    <div className="text-sm text-ink/70">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/40 md:hidden">
                        Email
                      </p>
                      {member.email}
                    </div>
                    <div className="text-sm text-ink/70">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/40 md:hidden">
                        Cargo
                      </p>
                      {member.ecclesiasticalRole}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <p className="w-full text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/40 md:hidden">
                        Acoes
                      </p>
                      {canManageMembers ? (
                        <>
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-9 w-full px-4 sm:w-auto"
                            onClick={() => loadMemberEditor(member)}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-9 w-full px-4 text-ember hover:bg-ember/8 hover:text-ember sm:w-auto"
                            onClick={() => handleDeleteMember(member)}
                            disabled={isMutatingMember && memberActionId === member.id}
                          >
                            {isMutatingMember && memberActionId === member.id
                              ? "Salvando..."
                              : "Inativar"}
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}

                <DashboardStateNotice
                  empty={!isLoadingManagementData && !managementDataError && !members.length}
                  emptyLabel="Nenhum membro disponivel neste escopo."
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                Dirigentes
              </p>
              <h4 className="mt-2 font-display text-2xl text-ink">
                Designacoes ativas
              </h4>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {managers.map((manager) => (
                <article
                  key={manager.id}
                  className="rounded-lg border border-line bg-stone p-5"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-ink/44">
                    Dirigente ativo
                  </p>
                  <h5 className="mt-2 font-display text-2xl text-ink">
                    {managerMemberName(manager, members)}
                  </h5>
                  <p className="mt-3 text-sm leading-6 text-ink/68">
                    {managerChurchName(manager, churches)}
                  </p>
                  <p className="mt-2 text-sm text-ink/56">
                    Inicio em {formatDate(manager.startDate)}
                  </p>

                  {canManageMembers ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-10 w-full sm:w-auto"
                        onClick={() => loadManagerReplacement(manager)}
                      >
                        Substituir
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 w-full sm:w-auto text-ember hover:bg-ember/8 hover:text-ember"
                        onClick={() => handleDeleteManager(manager)}
                        disabled={isMutatingManager && managerActionId === manager.id}
                      >
                        {isMutatingManager && managerActionId === manager.id
                          ? "Salvando..."
                          : "Encerrar designacao"}
                      </Button>
                    </div>
                  ) : null}
                </article>
              ))}

              <DashboardStateNotice
                empty={!isLoadingManagementData && !managementDataError && !managers.length}
                emptyLabel="Nenhuma designacao ativa encontrada."
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-cloud text-brass">
                <WorkflowIcon className="h-5 w-5" />
              </span>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                  Central de trabalho
                </p>
                <h4 className="font-display text-2xl text-ink">
                  Formularios
                </h4>
              </div>
            </div>

            <div className="mt-5">
              <SegmentedTabs
                value={workflowTab}
                onChange={setWorkflowTab}
                options={workflowOptions}
              />
            </div>
          </section>

          {workflowTab === "churches" ? (
            <section className="space-y-6">
              {canManageChurches ? (
                <form
                  className="space-y-4 rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur"
                  onSubmit={onCreateChurch}
                >
                  <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                      <PlusIcon className="h-4 w-4" />
                      Nova igreja
                    </p>
                    <h4 className="font-display text-2xl text-ink">
                      Criar igreja com dirigente inicial
                    </h4>
                    <p className="text-sm leading-6 text-ink/68">
                      Fluxo completo de implantacao: endereco, tipo de igreja e
                      dirigente responsavel no mesmo pacote.
                    </p>
                  </div>

                  <Input
                    label="Data de criacao"
                    type="date"
                    error={churchForm.formState.errors.date?.message}
                    {...churchForm.register("date")}
                  />
                  <Select
                    label="Tipo"
                    error={churchForm.formState.errors.type?.message}
                    {...churchForm.register("type")}
                  >
                    <option value="BRANCH">Congregacao</option>
                    <option value="HEADQUARTER">Sede</option>
                  </Select>
                  <Input
                    label="Rua"
                    error={churchForm.formState.errors.street?.message}
                    {...churchForm.register("street")}
                  />
                  <Input
                    label="Bairro"
                    error={churchForm.formState.errors.district?.message}
                    {...churchForm.register("district")}
                  />
                  <Input
                    label="Cidade"
                    error={churchForm.formState.errors.city?.message}
                    {...churchForm.register("city")}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Estado"
                      error={churchForm.formState.errors.state?.message}
                      {...churchForm.register("state")}
                    />
                    <Input
                      label="CEP"
                      error={churchForm.formState.errors.cep?.message}
                      {...churchForm.register("cep")}
                    />
                  </div>
                  <Input
                    label="Pais"
                    error={churchForm.formState.errors.country?.message}
                    {...churchForm.register("country")}
                  />

                  <div className="rounded-lg border border-line bg-stone p-4">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                      <LeadershipIcon className="h-4 w-4" />
                      Dirigente inicial
                    </p>
                    <div className="mt-4 space-y-4">
                      <Input
                        label="Nome completo"
                        error={churchForm.formState.errors.manager_name?.message}
                        {...churchForm.register("manager_name")}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="Nascimento"
                          type="date"
                          error={churchForm.formState.errors.manager_birth_date?.message}
                          {...churchForm.register("manager_birth_date")}
                        />
                        <Input
                          label="Batismo"
                          type="date"
                          error={churchForm.formState.errors.manager_batism_date?.message}
                          {...churchForm.register("manager_batism_date")}
                        />
                      </div>
                      <Input
                        label="Cargo eclesiastico"
                        error={
                          churchForm.formState.errors.manager_ecclesiasticalRole?.message
                        }
                        {...churchForm.register("manager_ecclesiasticalRole")}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="CPF"
                          error={churchForm.formState.errors.manager_cpf?.message}
                          {...churchForm.register("manager_cpf")}
                        />
                        <Input
                          label="RG"
                          error={churchForm.formState.errors.manager_rg?.message}
                          {...churchForm.register("manager_rg")}
                        />
                      </div>
                      <Input
                        label="Login inicial"
                        error={churchForm.formState.errors.manager_login?.message}
                        {...churchForm.register("manager_login")}
                      />
                      <Input
                        label="Email"
                        type="email"
                        error={churchForm.formState.errors.manager_email?.message}
                        {...churchForm.register("manager_email")}
                      />
                      <Input
                        label="Senha inicial opcional"
                        placeholder="Deixe vazio para usar o CPF, ou informe 1234"
                        error={churchForm.formState.errors.manager_password?.message}
                        {...churchForm.register("manager_password")}
                      />
                    </div>
                  </div>

                  <FormNotice error={churchError} success={churchSuccess} />

                  <Button type="submit" disabled={isSubmittingChurch}>
                    {isSubmittingChurch ? "Salvando..." : "Criar estrutura da igreja"}
                  </Button>
                </form>
              ) : (
                <div className="rounded-lg border border-line bg-stone p-6 text-sm leading-7 text-ink/68">
                  Seu perfil atual acompanha a estrutura de igrejas, mas a
                  criacao e edicao da governanca global seguem restritas a quem
                  opera com escopo de sede.
                </div>
              )}

              {selectedChurch && canManageChurches ? (
                <form
                  className="space-y-4 rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur"
                  onSubmit={onUpdateChurch}
                >
                  <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                      <EditIcon className="h-4 w-4" />
                      Editar igreja
                    </p>
                    <h4 className="font-display text-2xl text-ink">
                      {getChurchName(selectedChurch)}
                    </h4>
                  </div>

                  <Input
                    label="Data de criacao"
                    type="date"
                    error={churchEditForm.formState.errors.date?.message}
                    {...churchEditForm.register("date")}
                  />
                  <Input
                    label="Rua"
                    error={churchEditForm.formState.errors.street?.message}
                    {...churchEditForm.register("street")}
                  />
                  <Input
                    label="Bairro"
                    error={churchEditForm.formState.errors.district?.message}
                    {...churchEditForm.register("district")}
                  />
                  <Input
                    label="Cidade"
                    error={churchEditForm.formState.errors.city?.message}
                    {...churchEditForm.register("city")}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Estado"
                      error={churchEditForm.formState.errors.state?.message}
                      {...churchEditForm.register("state")}
                    />
                    <Input
                      label="CEP"
                      error={churchEditForm.formState.errors.cep?.message}
                      {...churchEditForm.register("cep")}
                    />
                  </div>
                  <Input
                    label="Pais"
                    error={churchEditForm.formState.errors.country?.message}
                    {...churchEditForm.register("country")}
                  />

                  <FormNotice error={churchEditError} success={churchEditSuccess} />

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isUpdatingChurch}>
                      {isUpdatingChurch ? "Salvando..." : "Salvar alteracoes"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setSelectedChurchId(null);
                        setChurchEditError(null);
                        setChurchEditSuccess(null);
                      }}
                    >
                      Fechar edicao
                    </Button>
                  </div>
                </form>
              ) : null}
            </section>
          ) : null}

          {workflowTab === "members" ? (
            <section className="space-y-6">
              {canManageMembers ? (
                <form
                  className="space-y-4 rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur"
                  onSubmit={onCreateMember}
                >
                  <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                      <PlusIcon className="h-4 w-4" />
                      Novo membro
                    </p>
                    <h4 className="font-display text-2xl text-ink">
                      Cadastro inicial com senha temporaria
                    </h4>
                    <p className="text-sm leading-6 text-ink/68">
                      Fluxo pensado para recepcao e pre-cadastro: identidade,
                      igreja de destino e credenciais iniciais no mesmo passo.
                    </p>
                  </div>

                  <Select
                    label="Igreja"
                    disabled={profile.access?.scope === "CHURCH"}
                    error={memberForm.formState.errors.id_church?.message}
                    {...memberForm.register("id_church")}
                  >
                    <option value="">Selecione</option>
                    {churchOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Nome completo"
                    error={memberForm.formState.errors.name?.message}
                    {...memberForm.register("name")}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Nascimento"
                      type="date"
                      error={memberForm.formState.errors.birth_date?.message}
                      {...memberForm.register("birth_date")}
                    />
                    <Input
                      label="Batismo"
                      type="date"
                      error={memberForm.formState.errors.batism_date?.message}
                      {...memberForm.register("batism_date")}
                    />
                  </div>
                  <Input
                    label="Cargo eclesiastico"
                    error={memberForm.formState.errors.ecclesiasticalRole?.message}
                    {...memberForm.register("ecclesiasticalRole")}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="CPF"
                      error={memberForm.formState.errors.cpf?.message}
                      {...memberForm.register("cpf")}
                    />
                    <Input
                      label="RG"
                      error={memberForm.formState.errors.rg?.message}
                      {...memberForm.register("rg")}
                    />
                  </div>
                  <Input
                    label="Login inicial"
                    error={memberForm.formState.errors.login?.message}
                    {...memberForm.register("login")}
                  />
                  <Input
                    label="Email"
                    type="email"
                    error={memberForm.formState.errors.email?.message}
                    {...memberForm.register("email")}
                  />
                  <Input
                    label="Senha inicial opcional"
                    placeholder="Deixe vazio para usar o CPF, ou informe 1234"
                    error={memberForm.formState.errors.password?.message}
                    {...memberForm.register("password")}
                  />

                  <FormNotice error={memberError} success={memberSuccess} />

                  <Button type="submit" disabled={isSubmittingMember}>
                    {isSubmittingMember ? "Salvando..." : "Criar membro"}
                  </Button>
                </form>
              ) : null}

              {selectedMember && canManageMembers ? (
                <form
                  className="space-y-4 rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur"
                  onSubmit={onUpdateMember}
                >
                  <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                      <EditIcon className="h-4 w-4" />
                      Editar membro
                    </p>
                    <h4 className="font-display text-2xl text-ink">
                      {selectedMember.name}
                    </h4>
                  </div>

                  <Select
                    label="Igreja"
                    disabled={profile.access?.scope === "CHURCH"}
                    error={memberEditForm.formState.errors.id_church?.message}
                    {...memberEditForm.register("id_church")}
                  >
                    <option value="">Selecione</option>
                    {churchOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Nome completo"
                    error={memberEditForm.formState.errors.name?.message}
                    {...memberEditForm.register("name")}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Nascimento"
                      type="date"
                      error={memberEditForm.formState.errors.birth_date?.message}
                      {...memberEditForm.register("birth_date")}
                    />
                    <Input
                      label="Batismo"
                      type="date"
                      error={memberEditForm.formState.errors.batism_date?.message}
                      {...memberEditForm.register("batism_date")}
                    />
                  </div>
                  <Input
                    label="Cargo eclesiastico"
                    error={memberEditForm.formState.errors.ecclesiasticalRole?.message}
                    {...memberEditForm.register("ecclesiasticalRole")}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="CPF"
                      error={memberEditForm.formState.errors.cpf?.message}
                      {...memberEditForm.register("cpf")}
                    />
                    <Input
                      label="RG"
                      error={memberEditForm.formState.errors.rg?.message}
                      {...memberEditForm.register("rg")}
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    error={memberEditForm.formState.errors.email?.message}
                    {...memberEditForm.register("email")}
                  />

                  <FormNotice error={memberEditError} success={memberEditSuccess} />

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isUpdatingMember}>
                      {isUpdatingMember ? "Salvando..." : "Salvar cadastro"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setSelectedMemberId(null);
                        setMemberEditError(null);
                        setMemberEditSuccess(null);
                      }}
                    >
                      Fechar edicao
                    </Button>
                  </div>
                </form>
              ) : null}
            </section>
          ) : null}

          {workflowTab === "managers" ? (
            <section className="space-y-6">
              {canManageMembers ? (
                <>
                  <form
                    className="space-y-4 rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur"
                    onSubmit={onReplaceManager}
                  >
                    <div className="space-y-2">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                        <WorkflowIcon className="h-4 w-4" />
                        Substituicao imediata
                      </p>
                      <h4 className="font-display text-2xl text-ink">
                        {selectedManager
                          ? `Trocar dirigente de ${managerChurchName(selectedManager, churches)}`
                          : "Selecione um dirigente para trocar"}
                      </h4>
                      <p className="text-sm leading-6 text-ink/68">
                        Primeiro selecione um dirigente ativo no painel e depois
                        conclua a troca aqui, sem deixar a igreja descoberta.
                      </p>
                    </div>

                    <Select
                      label="Novo dirigente"
                      disabled={!selectedManager}
                      error={managerReplaceForm.formState.errors.id_member?.message}
                      {...managerReplaceForm.register("id_member")}
                    >
                      <option value="">
                        {selectedManager ? "Selecione" : "Escolha antes no painel"}
                      </option>
                      {replacementMemberOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>

                    <FormNotice error={managerError} success={managerSuccess} />

                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="submit"
                        disabled={!selectedManager || isReplacingManager}
                      >
                        {isReplacingManager ? "Salvando..." : "Substituir dirigente"}
                      </Button>
                      {selectedManager ? (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setSelectedManagerId(null);
                            setManagerError(null);
                            setManagerSuccess(null);
                            managerReplaceForm.reset({
                              id_member: "",
                            });
                          }}
                        >
                          Limpar selecao
                        </Button>
                      ) : null}
                    </div>
                  </form>

                  <form
                    className="space-y-4 rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur"
                    onSubmit={onCreateManager}
                  >
                    <div className="space-y-2">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brass">
                        <PlusIcon className="h-4 w-4" />
                        Novo dirigente
                      </p>
                      <h4 className="font-display text-2xl text-ink">
                        Nomear dirigente no escopo atual
                      </h4>
                    </div>

                    <Select
                      label="Membro"
                      error={managerForm.formState.errors.id_member?.message}
                      {...managerForm.register("id_member")}
                    >
                      <option value="">Selecione</option>
                      {memberOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Igreja"
                      disabled={profile.access?.scope === "CHURCH"}
                      error={managerForm.formState.errors.id_church?.message}
                      {...managerForm.register("id_church")}
                    >
                      <option value="">Selecione</option>
                      {churchOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>

                    <FormNotice error={managerError} success={managerSuccess} />

                    <Button type="submit" disabled={isSubmittingManager}>
                      {isSubmittingManager ? "Salvando..." : "Nomear dirigente"}
                    </Button>
                  </form>
                </>
              ) : null}
            </section>
          ) : null}

          <div className="rounded-lg border border-line bg-stone p-6">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-moss">
              <LinkIcon className="h-4 w-4" />
              Estrutura
            </p>
            <p className="mt-3 text-sm leading-7 text-ink/70">Igrejas, membros e dirigentes.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
