import type {
  Church,
  CultOfferRecord,
  CultRecord,
  CostRecord,
  ManagerRecord,
  MeResponse,
  MemberRecord,
  OfferRecord,
  SessionResponse,
  SpecialOfferRecord,
  TitheRecord,
  TreasurerRecord,
} from "@/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:3333";

interface ApiErrorPayload {
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel concluir a solicitacao."
    );
  }

  return response.json() as Promise<T>;
}

export async function createSession(login: string, password: string) {
  const response = await fetch(`${API_URL}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login, password }),
  });

  return parseResponse<SessionResponse>(response);
}

export async function fetchProfile(token: string) {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<MeResponse>(response);
}

export async function updateOwnPassword(
  userId: number,
  token: string,
  password: string
) {
  const response = await fetch(`${API_URL}/user/${userId}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  return parseResponse<{ user: { id: number; login: string } }>(response);
}

export async function updateOwnLogin(
  userId: number,
  token: string,
  login: string
) {
  const response = await fetch(`${API_URL}/user/${userId}/login`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ login }),
  });

  return parseResponse<{ user: { id: number; login: string } }>(response);
}

export async function updateOwnMemberProfile(
  memberId: number,
  token: string,
  payload: {
    name: string;
    email: string;
    birth_date: string;
    rg: number;
  }
) {
  const response = await fetch(`${API_URL}/member/${memberId}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ member: MemberRecord }>(response);
}

export async function requestPasswordReset(email: string) {
  const response = await fetch(`${API_URL}/password/forgot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return parseResponse<{ message: string; resetToken?: string }>(response);
}

export async function resetPassword(token: string, password: string) {
  const response = await fetch(`${API_URL}/password/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  return parseResponse<{ message: string }>(response);
}

export async function fetchChurches(token: string) {
  const response = await fetch(`${API_URL}/church`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<{ churches: Church[] }>(response);
}

export async function fetchMembers(token: string) {
  const response = await fetch(`${API_URL}/member`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<{ members: MemberRecord[] }>(response);
}

export async function fetchManagers(token: string) {
  const response = await fetch(`${API_URL}/manager`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<{ managers: ManagerRecord[] }>(response);
}

export async function createChurch(
  token: string,
  payload: {
    date: string;
    street: string;
    district: string;
    city: string;
    state: string;
    country: string;
    cep: number;
    type?: "HEADQUARTER" | "BRANCH";
  }
) {
  const response = await fetch(`${API_URL}/church`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ church: Church }>(response);
}

export async function createChurchWithManager(
  token: string,
  payload: {
    church: {
      date: string;
      street: string;
      district: string;
      city: string;
      state: string;
      country: string;
      cep: number;
      type?: "HEADQUARTER" | "BRANCH";
    };
    manager: {
      name: string;
      birth_date: string;
      batism_date: string;
      ecclesiasticalRole: string;
      cpf: string;
      rg: number;
      login: string;
      email: string;
      password?: string;
    };
  }
) {
  const response = await fetch(`${API_URL}/church/structured`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{
    church: Church;
    manager: ManagerRecord;
    member: MemberRecord;
    user: { id: number; login: string };
  }>(response);
}

export async function updateChurch(
  token: string,
  churchId: number,
  payload: {
    date: string;
    street: string;
    district: string;
    city: string;
    state: string;
    country: string;
    cep: number;
  }
) {
  const response = await fetch(`${API_URL}/church/${churchId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ church: Church }>(response);
}

export async function deactivateChurch(token: string, churchId: number) {
  const response = await fetch(`${API_URL}/church/${churchId}/deactivate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<{ church: Church }>(response);
}

export async function reactivateChurch(token: string, churchId: number) {
  const response = await fetch(`${API_URL}/church/${churchId}/reactivate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<{ church: Church }>(response);
}

export async function deleteChurch(token: string, churchId: number) {
  const response = await fetch(`${API_URL}/church/${churchId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel excluir a igreja."
    );
  }
}

export async function createMember(
  token: string,
  payload: {
    id_church: number;
    name: string;
    birth_date: string;
    batism_date: string;
    ecclesiasticalRole: string;
    cpf: string;
    rg: number;
    login: string;
    email: string;
    password?: string;
  }
) {
  const response = await fetch(`${API_URL}/member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ member: MemberRecord }>(response);
}

export async function updateMember(
  token: string,
  memberId: number,
  payload: {
    id_church: number;
    name: string;
    birth_date: string;
    batism_date: string;
    ecclesiasticalRole: string;
    cpf: string;
    rg: number;
    email: string;
  }
) {
  const response = await fetch(`${API_URL}/member/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ member: MemberRecord }>(response);
}

export async function deleteMember(token: string, memberId: number) {
  const response = await fetch(`${API_URL}/member/${memberId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel inativar o membro."
    );
  }
}

export async function createManager(
  token: string,
  payload: {
    id_member: number;
    id_church: number;
  }
) {
  const response = await fetch(`${API_URL}/manager`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ manager: ManagerRecord }>(response);
}

export async function deleteManager(token: string, managerId: number) {
  const response = await fetch(`${API_URL}/manager/${managerId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel encerrar a designacao."
    );
  }
}

export async function replaceManager(
  token: string,
  managerId: number,
  payload: {
    id_member: number;
  }
) {
  const response = await fetch(`${API_URL}/manager/${managerId}/replace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{
    previousManager: ManagerRecord;
    manager: ManagerRecord;
  }>(response);
}

export async function fetchTreasurers(token: string) {
  const response = await fetch(`${API_URL}/treasurer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<{ treasurers: TreasurerRecord[] }>(response);
}

export async function createTreasurer(
  token: string,
  memberId: number
) {
  const response = await fetch(`${API_URL}/treasurer/${memberId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<{ treasurer: TreasurerRecord }>(response);
}

export async function deleteTreasurer(token: string, treasurerId: number) {
  const response = await fetch(`${API_URL}/treasurer/${treasurerId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel encerrar a tesouraria."
    );
  }
}

export async function updateTreasurer(
  token: string,
  treasurerId: number,
  payload: {
    id_member: number;
  }
) {
  const response = await fetch(`${API_URL}/treasurer/${treasurerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ treasurer: TreasurerRecord }>(response);
}

export async function fetchCosts(token: string) {
  const response = await fetch(`${API_URL}/cost`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<{ costs: CostRecord[] }>(response);
}

export async function createCost(
  token: string,
  payload: {
    value: number;
    date: string;
    description: string;
    id_church: number;
  }
) {
  const response = await fetch(`${API_URL}/cost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ cost: CostRecord }>(response);
}

export async function deleteCost(token: string, costId: number) {
  const response = await fetch(`${API_URL}/cost/${costId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel excluir a despesa."
    );
  }
}

export async function updateCost(
  token: string,
  costId: number,
  payload: {
    value: number;
    date: string;
    description: string;
  }
) {
  const response = await fetch(`${API_URL}/cost/${costId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ cost: CostRecord }>(response);
}

export async function fetchOffers(token: string) {
  const response = await fetch(`${API_URL}/offer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<{ offers: OfferRecord[] }>(response);
}

export async function createOffer(
  token: string,
  payload: {
    id_treasurer: number;
    value: number;
  }
) {
  const response = await fetch(`${API_URL}/offer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ offer: OfferRecord }>(response);
}

export async function deleteOffer(token: string, offerId: number) {
  const response = await fetch(`${API_URL}/offer/${offerId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel excluir a oferta."
    );
  }
}

export async function updateOffer(
  token: string,
  offerId: number,
  payload: {
    id_treasurer: number;
    value: number;
  }
) {
  const response = await fetch(`${API_URL}/offer/${offerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ offer: OfferRecord }>(response);
}

export async function fetchSpecialOffers(token: string) {
  const response = await fetch(`${API_URL}/specialOffer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<{ specialOffers: SpecialOfferRecord[] }>(response);
}

export async function createSpecialOffer(
  token: string,
  payload: {
    id_church: number;
    id_member: number;
    id_treasurer: number;
    value: number;
    reason: string;
    date: string;
  }
) {
  const response = await fetch(`${API_URL}/specialOffer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ specialOffer: SpecialOfferRecord }>(response);
}

export async function updateSpecialOffer(
  token: string,
  specialOfferId: number,
  payload: {
    id_church: number;
    id_member: number;
    id_treasurer: number;
    value: number;
    reason: string;
    date: string;
  }
) {
  const response = await fetch(`${API_URL}/specialOffer/${specialOfferId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ specialOffer: SpecialOfferRecord }>(response);
}

export async function deleteSpecialOffer(token: string, specialOfferId: number) {
  const response = await fetch(`${API_URL}/specialOffer/${specialOfferId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel excluir a oferta especial."
    );
  }
}

export async function fetchTithes(token: string) {
  const response = await fetch(`${API_URL}/tithe`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<{ tithes: TitheRecord[] }>(response);
}

export async function createTithe(
  token: string,
  payload: {
    id_church: number;
    id_member: number;
    reason: string;
    date: string;
    month: number;
    year: number;
    value: number;
    id_treasurer: number;
  }
) {
  const response = await fetch(`${API_URL}/tithe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ tithe: TitheRecord }>(response);
}

export async function deleteTithe(token: string, titheId: number) {
  const response = await fetch(`${API_URL}/tithe/${titheId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel excluir o dizimo."
    );
  }
}

export async function updateTithe(
  token: string,
  titheId: number,
  payload: {
    id_church: number;
    id_member: number;
    reason: string;
    date: string;
    month: number;
    year: number;
    value: number;
    id_treasurer: number;
  }
) {
  const response = await fetch(`${API_URL}/tithe/${titheId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ tithe: TitheRecord }>(response);
}

export async function fetchCults(token: string) {
  const response = await fetch(`${API_URL}/cult`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse<{ cults: CultRecord[] }>(response);
}

export async function createCult(
  token: string,
  payload: {
    date: string;
    theme: string;
    id_church: number;
  }
) {
  const response = await fetch(`${API_URL}/cult`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ cult: CultRecord }>(response);
}

export async function createRecurringCultSeries(
  token: string,
  payload: {
    id_church: number;
    date: string;
    theme: string;
    recurrence: {
      interval: number;
      until: string;
    };
  }
) {
  const response = await fetch(`${API_URL}/cult/recurring`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ cults: CultRecord[] }>(response);
}

export async function updateCult(
  token: string,
  cultId: number,
  payload: {
    date: string;
    theme: string;
    id_church: number;
  }
) {
  const response = await fetch(`${API_URL}/cult/${cultId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ cult: CultRecord }>(response);
}

export async function updateRecurringCultSeries(
  token: string,
  cultId: number,
  payload: {
    id_church: number;
    theme: string;
  }
) {
  const response = await fetch(`${API_URL}/cult/${cultId}/series`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ cults: CultRecord[] }>(response);
}

export async function deleteCult(token: string, cultId: number) {
  const response = await fetch(`${API_URL}/cult/${cultId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

    throw new ApiError(
      response.status,
      payload.error || payload.message || "Nao foi possivel excluir o culto."
    );
  }
}

export async function createCultOffer(
  token: string,
  cultId: number,
  payload: {
    id_treasurer: number;
    value: number;
  }
) {
  const response = await fetch(`${API_URL}/cult/${cultId}/offers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ cultOffer: CultOfferRecord }>(response);
}

export async function updateCultOffer(
  token: string,
  cultId: number,
  cultOfferId: number,
  payload: {
    id_treasurer: number;
    value: number;
  }
) {
  const response = await fetch(`${API_URL}/cult/${cultId}/offers/${cultOfferId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ cultOffer: CultOfferRecord }>(response);
}

export async function deleteCultOffer(
  token: string,
  cultId: number,
  cultOfferId: number
) {
  const response = await fetch(`${API_URL}/cult/${cultId}/offers/${cultOfferId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<{ cultOffer: CultOfferRecord }>(response);
}
