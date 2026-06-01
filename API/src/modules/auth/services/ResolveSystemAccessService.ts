import { IChurchRepository } from "../../churches/repositories/IChurchRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IManagerRepository } from "../../manager/repositories/IManagerRepository";
import { ITreasurerRepository } from "../../treasurer/repositories/ITreasurerRepository";

export type SystemAccessLevel = "MEMBER" | "VIEWER" | "EDITOR";
export type SystemAccessScope = "GLOBAL" | "CHURCH";

interface IResponse {
  level: SystemAccessLevel;
  scope: SystemAccessScope;
  memberId: number;
  churchId: number;
  permissions: {
    canViewManagementData: boolean;
    canEditManagementData: boolean;
  };
}

export default class ResolveSystemAccessService {
  constructor(
    private churchRepository: IChurchRepository,
    private memberRepository: IMemberRepository,
    private managerRepository: IManagerRepository,
    private treasurerRepository: ITreasurerRepository
  ) {
    this.churchRepository = churchRepository;
    this.memberRepository = memberRepository;
    this.managerRepository = managerRepository;
    this.treasurerRepository = treasurerRepository;
  }

  async execute(id_user: number): Promise<IResponse | undefined> {
    const member = await this.memberRepository.findByUserId(id_user);

    if (!member) return undefined;

    const church = await this.churchRepository.findById(member.id_church);

    if (!church) return undefined;

    const [manager, treasurer] = await Promise.all([
      this.managerRepository.findByMember(member.id),
      this.treasurerRepository.findByMember(member.id),
    ]);

    const scope: SystemAccessScope =
      church.type === "HEADQUARTER" ? "GLOBAL" : "CHURCH";

    if (treasurer) {
      return {
        level: "EDITOR",
        scope,
        memberId: member.id,
        churchId: member.id_church,
        permissions: {
          canViewManagementData: true,
          canEditManagementData: true,
        },
      };
    }

    if (manager) {
      const isGlobalManager = scope === "GLOBAL";

      return {
        level: isGlobalManager ? "EDITOR" : "VIEWER",
        scope,
        memberId: member.id,
        churchId: manager.id_church,
        permissions: {
          canViewManagementData: true,
          canEditManagementData: isGlobalManager,
        },
      };
    }

    return {
      level: "MEMBER",
      scope,
      memberId: member.id,
      churchId: member.id_church,
      permissions: {
        canViewManagementData: false,
        canEditManagementData: false,
      },
    };
  }
}
