import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const apiUrl = process.env.PLAYWRIGHT_API_URL || "http://127.0.0.1:3333";

const headquarterUser = {
  login: "lider.sede",
  email: "lider.sede@churchapp.local",
  cpf: "12345678901",
  finalPassword: "NovaSenha123",
};

const branchUser = {
  login: "lider.filial",
  cpf: "23456789012",
  finalPassword: "FilialSenha123",
};

const treasurerUser = {
  login: "tesouraria.campinas",
  cpf: "34567890123",
  finalPassword: "Tesouraria123",
};

const memberUser = {
  login: "membro.campinas",
  cpf: "45678901234",
  finalPassword: "MembroSenha123",
};

const requiredPasswordHeading = "Defina uma senha definitiva para continuar.";

async function bootstrapHeadquarter(apiRequest: APIRequestContext) {
  const response = await apiRequest.post(`${apiUrl}/church/bootstrap`, {
    data: {
      church: {
        date: "2024-01-15",
        street: "Rua Central",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP",
        country: "Brasil",
        cep: 1001000,
        type: "HEADQUARTER",
      },
      manager: {
        name: "Lider da Sede",
        birth_date: "1990-01-10",
        batism_date: "2005-02-20",
        ecclesiasticalRole: "Dirigente",
        cpf: headquarterUser.cpf,
        rg: 123456789,
        login: headquarterUser.login,
        email: headquarterUser.email,
      },
    },
  });

  expect(response.ok()).toBeTruthy();
}

async function login(page: Page, loginValue: string, password: string) {
  await page.goto("/");
  await page.getByLabel("Login").fill(loginValue);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Acessar" }).click();
  await page.waitForURL(/\/portal/);
}

async function definePassword(page: Page, password: string) {
  await page.getByLabel("Nova senha").fill(password);
  await page.getByRole("button", { name: "Salvar nova senha" }).click();
  await expect(
    page.getByRole("heading", {
      name: requiredPasswordHeading,
    })
  ).toHaveCount(0);
}

async function authenticateHeadquarter(apiRequest: APIRequestContext) {
  const response = await apiRequest.post(`${apiUrl}/session`, {
    data: {
      login: headquarterUser.login,
      password: headquarterUser.finalPassword,
    },
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return body.token as string;
}

test.describe.serial("Portal web flows", () => {
  test.beforeAll(async ({ request }) => {
    await bootstrapHeadquarter(request);
  });

  test("forces the initial member to change the password and opens the isolated card route", async ({
    page,
  }) => {
    await login(page, headquarterUser.login, headquarterUser.cpf);

    await expect(
      page.getByRole("heading", {
        name: requiredPasswordHeading,
      })
    ).toBeVisible();

    await definePassword(page, headquarterUser.finalPassword);
    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: requiredPasswordHeading,
      })
    ).toHaveCount(0);

    await page.getByRole("button", { name: "Minha carteirinha" }).click();
    await page.waitForURL("**/portal/carteirinha");

    await expect(page.getByText("Carteirinha de membro")).toBeVisible();
    await expect(page.getByText("Portal do membro")).toHaveCount(0);

    await page.getByRole("button", { name: "Voltar ao portal" }).click();
    await page.waitForURL("**/portal");
    await page.getByRole("button", { name: "Recolher menu lateral" }).click();
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
    await page.getByRole("button", { name: "Expandir menu lateral" }).click();
    await expect(page.getByRole("button", { name: "Encerrar sessao" })).toBeVisible();
  });

  test("lets the headquarter manager create a branch and the new branch manager sign in", async ({
    browser,
    page,
  }) => {
    await login(page, headquarterUser.login, headquarterUser.finalPassword);

    await page.getByRole("button", { name: "Gestao" }).click();
    await expect(
      page.getByRole("heading", { name: "Criar igreja com dirigente inicial" })
    ).toBeVisible();

    const createChurchForm = page.locator("form").filter({
      has: page.getByRole("heading", { name: "Criar igreja com dirigente inicial" }),
    });

    await createChurchForm.getByLabel("Data de criacao", { exact: true }).fill("2024-02-10");
    await createChurchForm.getByLabel("Rua", { exact: true }).fill("Rua da Filial");
    await createChurchForm.getByLabel("Bairro", { exact: true }).fill("Bairro Novo");
    await createChurchForm.getByLabel("Cidade", { exact: true }).fill("Campinas");
    await createChurchForm.getByLabel("Estado", { exact: true }).fill("SP");
    await createChurchForm.getByLabel("CEP", { exact: true }).fill("13010000");
    await createChurchForm.getByLabel("Pais", { exact: true }).fill("Brasil");
    await createChurchForm.getByLabel("Nome completo", { exact: true }).fill("Lider da Filial");
    await createChurchForm.getByLabel("Nascimento", { exact: true }).fill("1992-03-05");
    await createChurchForm.getByLabel("Batismo", { exact: true }).fill("2008-08-15");
    await createChurchForm.getByLabel("Cargo eclesiastico", { exact: true }).fill("Dirigente");
    await createChurchForm.getByLabel("CPF", { exact: true }).fill(branchUser.cpf);
    await createChurchForm.getByLabel("RG", { exact: true }).fill("234567890");
    await createChurchForm.getByLabel("Login inicial", { exact: true }).fill(branchUser.login);
    await createChurchForm.getByLabel("Email", { exact: true }).fill("lider.filial@churchapp.local");
    await createChurchForm.getByLabel("Senha inicial opcional", { exact: true }).fill("1234");
    await createChurchForm
      .getByRole("button", { name: "Criar estrutura da igreja" })
      .click();

    await expect(
      page.getByText("Igreja criada com dirigente inicial no mesmo fluxo.")
    ).toBeVisible();

    const branchContext = await browser.newContext();
    const branchPage = await branchContext.newPage();

    await login(branchPage, branchUser.login, "1234");
    await expect(
      branchPage.getByRole("heading", {
        name: requiredPasswordHeading,
      })
    ).toBeVisible();

    await definePassword(branchPage, branchUser.finalPassword);
    await branchPage.reload();

    await expect(branchPage.getByRole("button", { name: "Gestao" })).toBeVisible();
    await expect(branchPage.getByRole("button", { name: "Cultos" })).toBeVisible();
    await expect(branchPage.getByRole("button", { name: "Financeiro" })).toBeVisible();

    await branchPage.getByRole("button", { name: "Cultos" }).click();
    await expect(
      branchPage.getByRole("heading", { name: "Cultos", exact: true })
    ).toBeVisible();

    await branchContext.close();
  });

  test("lets a local treasurer operate finance, recurring cults, cult offers and own profile", async ({
    page,
    request,
  }) => {
    const globalToken = await authenticateHeadquarter(request);

    const churchesResponse = await request.get(`${apiUrl}/church`, {
      headers: {
        Authorization: `Bearer ${globalToken}`,
      },
    });
    expect(churchesResponse.ok()).toBeTruthy();
    const churchesPayload = await churchesResponse.json();
    const campinasChurch = churchesPayload.churches.find(
      (church: { location?: { city?: string } }) => church.location?.city === "Campinas"
    );

    expect(campinasChurch).toBeTruthy();

    const createMemberResponse = await request.post(`${apiUrl}/member`, {
      headers: {
        Authorization: `Bearer ${globalToken}`,
      },
      data: {
        id_church: campinasChurch.id,
        name: "Tesouraria de Campinas",
        birth_date: "1991-05-12",
        batism_date: "2010-09-03",
        ecclesiasticalRole: "Cooperadora",
        cpf: treasurerUser.cpf,
        rg: 345678901,
        login: treasurerUser.login,
        email: "tesouraria.campinas@churchapp.local",
        password: "1234",
      },
    });

    expect(createMemberResponse.ok()).toBeTruthy();
    const createdMemberPayload = await createMemberResponse.json();

    const createTreasurerResponse = await request.post(
      `${apiUrl}/treasurer/${createdMemberPayload.member.id}`,
      {
        headers: {
          Authorization: `Bearer ${globalToken}`,
        },
      }
    );

    expect(createTreasurerResponse.ok()).toBeTruthy();

    await login(page, treasurerUser.login, "1234");
    await definePassword(page, treasurerUser.finalPassword);
    await page.reload();

    await page.getByRole("button", { name: "Financeiro" }).click();
    await expect(
      page.getByRole("heading", { name: "Financeiro", exact: true })
    ).toBeVisible();

    const financeWorkspace = page.locator("section").filter({
      has: page.getByText("Central financeira"),
    });

    await financeWorkspace.getByRole("tab", { name: "Despesas" }).click();
    await financeWorkspace.getByLabel("Descricao", { exact: true }).fill("Internet da congregacao");
    await financeWorkspace.getByLabel("Valor", { exact: true }).fill("189.9");
    await financeWorkspace.getByLabel("Data", { exact: true }).fill("2024-06-01");
    await financeWorkspace.getByRole("button", { name: "Registrar despesa" }).click();

    await expect(page.getByText("Despesa registrada com sucesso.")).toBeVisible();

    await page.getByRole("button", { name: "Cultos" }).click();
    await expect(
      page.getByRole("heading", { name: "Cultos", exact: true })
    ).toBeVisible();

    const cultWorkspace = page.locator("section").filter({
      has: page.getByText("Central de trabalho"),
    });

    await cultWorkspace.getByRole("tab", { name: "Novo culto" }).click();
    await cultWorkspace.getByLabel("Data", { exact: true }).fill("2024-06-08");
    await cultWorkspace.getByLabel("Tema", { exact: true }).fill("Culto da familia");
    await cultWorkspace.getByRole("button", { name: "Cadastrar culto" }).click();

    await expect(page.getByText("Culto cadastrado com sucesso.")).toBeVisible();
    await expect(page.getByText("Culto da familia")).toBeVisible();

    await cultWorkspace.getByRole("tab", { name: "Serie semanal" }).click();
    await cultWorkspace.getByLabel("Primeira data").fill("2024-06-09");
    await cultWorkspace.getByLabel("Tema da serie").fill("Culto de domingo");
    await cultWorkspace.getByLabel("Intervalo semanal").fill("1");
    await cultWorkspace.getByLabel("Repetir ate").fill("2024-06-30");
    await cultWorkspace.getByRole("button", { name: "Criar serie recorrente" }).click();

    await expect(page.getByText("Serie recorrente criada com sucesso.")).toBeVisible();

    await page.getByRole("button", { name: "Ver ofertas" }).first().click();
    await expect(page.getByText("Lancamentos deste culto")).toBeVisible();
    await cultWorkspace.getByRole("tab", { name: "Ofertas" }).click();
    await cultWorkspace.getByLabel("Valor da oferta").fill("320");
    await cultWorkspace.getByRole("button", { name: "Registrar oferta" }).click();

    await expect(page.getByText("Oferta do culto registrada com sucesso.")).toBeVisible();
    await expect(cultWorkspace.getByText("R$ 320,00").first()).toBeVisible();

    await page.getByRole("button", { name: "Minha conta" }).click();
    await expect(page.getByRole("heading", { name: "Minha conta" })).toBeVisible();

    const accountWorkspace = page.locator("article").filter({
      has: page.getByText("Minha conta"),
    });

    await accountWorkspace.getByRole("tab", { name: "Dados pessoais" }).click();
    await accountWorkspace.getByLabel("Nome completo").fill("Tesouraria Campinas Atualizada");
    await accountWorkspace.getByLabel("Email").fill("tesouraria.atualizada@churchapp.local");
    await accountWorkspace.getByLabel("Nascimento").fill("1991-06-01");
    await accountWorkspace.getByLabel("RG").fill("987654321");
    await accountWorkspace
      .getByRole("button", { name: "Salvar dados pessoais" })
      .click();

    await expect(
      page.getByText("Dados pessoais atualizados com sucesso.")
    ).toBeVisible();
    await expect(
      page.getByText("tesouraria.atualizada@churchapp.local", { exact: true })
    ).toBeVisible();
  });

  test("keeps a regular member limited to card and account on mobile", async ({
    page,
    request,
  }) => {
    const globalToken = await authenticateHeadquarter(request);

    const churchesResponse = await request.get(`${apiUrl}/church`, {
      headers: {
        Authorization: `Bearer ${globalToken}`,
      },
    });
    expect(churchesResponse.ok()).toBeTruthy();
    const churchesPayload = await churchesResponse.json();
    const campinasChurch = churchesPayload.churches.find(
      (church: { location?: { city?: string } }) => church.location?.city === "Campinas"
    );

    expect(campinasChurch).toBeTruthy();

    const createMemberResponse = await request.post(`${apiUrl}/member`, {
      headers: {
        Authorization: `Bearer ${globalToken}`,
      },
      data: {
        id_church: campinasChurch.id,
        name: "Membro Regular Campinas",
        birth_date: "1994-07-18",
        batism_date: "2012-11-11",
        ecclesiasticalRole: "Membro",
        cpf: memberUser.cpf,
        rg: 456789012,
        login: memberUser.login,
        email: "membro.campinas@churchapp.local",
        password: "1234",
      },
    });

    expect(createMemberResponse.ok()).toBeTruthy();

    await page.setViewportSize({ width: 390, height: 820 });
    await login(page, memberUser.login, "1234");
    await expect(
      page.getByRole("heading", {
        name: requiredPasswordHeading,
      })
    ).toBeVisible();
    await definePassword(page, memberUser.finalPassword);
    await page.reload();

    await expect(
      page.getByRole("button", { name: "Abrir menu lateral" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Abrir menu lateral" }).click();
    await expect(page.getByRole("button", { name: "Minha carteirinha" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Minha conta" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Gestao" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Cultos" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Financeiro" })).toHaveCount(0);

    await page.getByRole("button", { name: "Minha carteirinha" }).click();
    await page.waitForURL("**/portal/carteirinha");
    await expect(page.getByText("Carteirinha de membro")).toBeVisible();
    await expect(page.getByText("Portal do membro")).toHaveCount(0);
    await page.getByRole("button", { name: "Voltar ao portal" }).click();
    await page.waitForURL("**/portal");

    await page.getByRole("button", { name: "Abrir menu lateral" }).click();
    await page.getByRole("button", { name: "Minha conta" }).click();
    await expect(page.getByRole("heading", { name: "Minha conta" })).toBeVisible();

    await page.getByRole("tab", { name: "Dados pessoais" }).click();
    await page.getByLabel("Nome completo").fill("Membro Regular Atualizado");
    await page.getByLabel("Email").fill("membro.atualizado@churchapp.local");
    await page.getByLabel("Nascimento").fill("1994-07-19");
    await page.getByLabel("RG").fill("456789999");
    await page.getByRole("button", { name: "Salvar dados pessoais" }).click();

    await expect(
      page.getByText("Dados pessoais atualizados com sucesso.")
    ).toBeVisible();
    await expect(
      page.getByText("membro.atualizado@churchapp.local", { exact: true })
    ).toBeVisible();
  });
});
