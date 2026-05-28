import ChurchRepository from "../../modules/churches/infra/prisma/repositories/ChurchRepository";
import LocationRepository from "../../modules/churches/infra/prisma/repositories/LocationRepository";
import MemberRepository from "../../modules/members/infra/prisma/repositories/MemberRepository";
import { UserRepository } from "../../modules/members/infra/prisma/repositories/UserRepository";
import ManagerRepository from "../../modules/manager/infra/prisma/repositories/ManagerRepository";
import SpecialOfferRepository from "../../modules/specialOffer/infra/prisma/repositories/SpecialOfferRepository";
import TreasurerRepository from "../../modules/treasurer/infra/prisma/repositories/TreasurerRepository";
import CreateNewChurchService from "../../modules/churches/services/CreateNewChurchService";
import DeleteChurchService from "../../modules/churches/services/DeleteChurchService";
import DeactivateChurchService from "../../modules/churches/services/DeactivateChurchService";
import ReactivateChurchService from "../../modules/churches/services/ReactivateChurchService";
import UpdateChurchService from "../../modules/churches/services/UpdateChurchService";
import AuthenticateUserService from "../../modules/auth/services/AuthenticateUserService";
import GetAuthenticatedProfileService from "../../modules/auth/services/GetAuthenticatedProfileService";
import ResolveSystemAccessService from "../../modules/auth/services/ResolveSystemAccessService";
import CreateNewMemberService from "../../modules/members/services/CreateNewMemberService";
import DeleteMemberService from "../../modules/members/services/DeleteMemberService";
import UpdateMemberService from "../../modules/members/services/UpdateMemberService";
import UpdateUserLoginService from "../../modules/members/services/UpdateUserLoginService";
import UpdateUserPasswordService from "../../modules/members/services/UpdateUserPasswordService";
import CreateNewManagerService from "../../modules/manager/services/CreateNewManageService";
import DeleteManagerService from "../../modules/manager/services/DeleteManagerService";
import UpdateManagerService from "../../modules/manager/services/UpdateManagerService";
import CultRepository from "../../modules/cult/infra/prisma/repositories/CultRepository";
import CreateNewCultService from "../../modules/cult/services/CreateNewCultService";
import DeleteCultService from "../../modules/cult/services/DeleteCultService";
import UpdateCultService from "../../modules/cult/services/UpdateCultService";
import CostRepository from "../../modules/cost/infra/prisma/repositories/CostRepository";
import CreateNewCostService from "../../modules/cost/services/CreateNewCostService";
import DeleteCostService from "../../modules/cost/services/DeleteCostService";
import UpdateCostService from "../../modules/cost/services/UpdateCostService";
import CreateNewSpecialOfferService from "../../modules/specialOffer/services/CreateNewSpecialOfferService";
import CreateNewTitheService from "../../modules/tithe/services/CreateNewTitheService";
import DeleteTitheService from "../../modules/tithe/services/DeleteTitheService";
import UpdateTitheService from "../../modules/tithe/services/UpdateTitheService";
import CreateNewTreasurerService from "../../modules/treasurer/services/CreateNewTreasurerService";
import DeleteTreasurerService from "../../modules/treasurer/services/DeleteTreasurerService";
import UpdateTreasurerService from "../../modules/treasurer/services/UpdateTreasurerService";
import OfferRepository from "../modules/offer/infra/prisma/repositories/OfferRepository";
import CreateNewOfferService from "../modules/offer/services/CreateNewOfferService";
import DeleteOfferService from "../modules/offer/services/DeleteOfferService";
import UpdateOfferService from "../modules/offer/services/UpdateOfferService";
import TitheRepository from "../../modules/tithe/infra/prisma/repositories/TitheRepository";

export const churchRepository = new ChurchRepository();
export const locationRepository = new LocationRepository();
export const memberRepository = new MemberRepository();
export const userRepository = new UserRepository();
export const managerRepository = new ManagerRepository();
export const cultRepository = new CultRepository();
export const costRepository = new CostRepository();
export const treasurerRepository = new TreasurerRepository();
export const offerRepository = new OfferRepository();
export const specialOfferRepository = new SpecialOfferRepository();
export const titheRepository = new TitheRepository();

export function makeCreateChurchService() {
  return new CreateNewChurchService(churchRepository, locationRepository);
}

export function makeDeleteChurchService() {
  return new DeleteChurchService(churchRepository);
}

export function makeUpdateChurchService() {
  return new UpdateChurchService(churchRepository, locationRepository);
}

export function makeDeactivateChurchService() {
  return new DeactivateChurchService(churchRepository);
}

export function makeReactivateChurchService() {
  return new ReactivateChurchService(churchRepository);
}

export function makeCreateMemberService() {
  return new CreateNewMemberService(
    memberRepository,
    userRepository,
    churchRepository
  );
}

export function makeAuthenticateUserService() {
  return new AuthenticateUserService(userRepository, memberRepository);
}

export function makeGetAuthenticatedProfileService() {
  return new GetAuthenticatedProfileService(userRepository, memberRepository);
}

export function makeResolveSystemAccessService() {
  return new ResolveSystemAccessService(
    churchRepository,
    memberRepository,
    managerRepository,
    treasurerRepository
  );
}

export function makeUpdateMemberService() {
  return new UpdateMemberService(memberRepository, churchRepository);
}

export function makeDeleteMemberService() {
  return new DeleteMemberService(memberRepository, userRepository);
}

export function makeUpdateUserLoginService() {
  return new UpdateUserLoginService(userRepository);
}

export function makeUpdateUserPasswordService() {
  return new UpdateUserPasswordService(userRepository);
}

export function makeCreateManagerService() {
  return new CreateNewManagerService(
    memberRepository,
    churchRepository,
    managerRepository
  );
}

export function makeCreateCultService() {
  return new CreateNewCultService(cultRepository, churchRepository);
}

export function makeUpdateCultService() {
  return new UpdateCultService(cultRepository, churchRepository);
}

export function makeDeleteCultService() {
  return new DeleteCultService(cultRepository);
}

export function makeCreateCostService() {
  return new CreateNewCostService(costRepository, churchRepository);
}

export function makeUpdateCostService() {
  return new UpdateCostService(costRepository);
}

export function makeDeleteCostService() {
  return new DeleteCostService(costRepository);
}

export function makeUpdateManagerService() {
  return new UpdateManagerService(
    memberRepository,
    churchRepository,
    managerRepository
  );
}

export function makeDeleteManagerService() {
  return new DeleteManagerService(managerRepository);
}

export function makeCreateTreasurerService() {
  return new CreateNewTreasurerService(memberRepository, treasurerRepository);
}

export function makeUpdateTreasurerService() {
  return new UpdateTreasurerService(memberRepository, treasurerRepository);
}

export function makeDeleteTreasurerService() {
  return new DeleteTreasurerService(treasurerRepository);
}

export function makeCreateSpecialOfferService() {
  return new CreateNewSpecialOfferService(
    offerRepository,
    specialOfferRepository,
    treasurerRepository,
    churchRepository,
    memberRepository
  );
}

export function makeCreateOfferService() {
  return new CreateNewOfferService(offerRepository, treasurerRepository);
}

export function makeUpdateOfferService() {
  return new UpdateOfferService(offerRepository, treasurerRepository);
}

export function makeDeleteOfferService() {
  return new DeleteOfferService(offerRepository);
}

export function makeCreateTitheService() {
  return new CreateNewTitheService(
    offerRepository,
    specialOfferRepository,
    titheRepository,
    treasurerRepository,
    churchRepository,
    memberRepository
  );
}

export function makeUpdateTitheService() {
  return new UpdateTitheService(
    offerRepository,
    specialOfferRepository,
    titheRepository,
    treasurerRepository,
    churchRepository,
    memberRepository
  );
}

export function makeDeleteTitheService() {
  return new DeleteTitheService(
    offerRepository,
    titheRepository,
    specialOfferRepository
  );
}
