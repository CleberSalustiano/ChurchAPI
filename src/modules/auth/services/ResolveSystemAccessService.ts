import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IManagerRepository } from "../../manager/repositories/IManagerRepository";
import { ITreasurerRepository } from "../../treasurer/repositories/ITreasurerRepository";

export type SystemAccessLevel = "MEMBER" | "VIEWER" | "EDITOR";

interface IResponse {
  level: SystemAccessLevel;
  memberId: number;
  churchId: number;
  permissions: {
    canViewManagementData: boolean;
    canEditManagementData: boolean;
  };
}

export default class ResolveSystemAccessService {
  constructor(
    private memberRepository: IMemberRepository,
    private managerRepository: IManagerRepository,
    private treasurerRepository: ITreasurerRepository
  ) {
    this.memberRepository = memberRepository;
    this.managerRepository = managerRepository;
    this.treasurerRepository = treasurerRepository;
  }

  async execute(id_user: number): Promise<IResponse | undefined> {
    const member = await this.memberRepository.findByUserId(id_user);

    if (!member) return undefined;

    const [manager, treasurer] = await Promise.all([
      this.managerRepository.findByMember(member.id),
      this.treasurerRepository.findByMember(member.id),
    ]);

    if (treasurer) {
      return {
        level: "EDITOR",
        memberId: member.id,
        churchId: member.id_church,
        permissions: {
          canViewManagementData: true,
          canEditManagementData: true,
        },
      };
    }

    if (manager) {
      return {
        level: "VIEWER",
        memberId: member.id,
        churchId: manager.id_church,
        permissions: {
          canViewManagementData: true,
          canEditManagementData: false,
        },
      };
    }

    return {
      level: "MEMBER",
      memberId: member.id,
      churchId: member.id_church,
      permissions: {
        canViewManagementData: false,
        canEditManagementData: false,
      },
    };
  }
}
