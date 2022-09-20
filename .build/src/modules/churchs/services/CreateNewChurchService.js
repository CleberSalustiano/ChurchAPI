var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  default: () => CreateNewChurchService_default
});
class CreateNewChurchService {
  constructor(churchRepository) {
    this.churchRepository = churchRepository;
    this.churchRepository = churchRepository;
  }
  async execute(data) {
    const church = await this.churchRepository.create(data);
    return church;
  }
}
var CreateNewChurchService_default = CreateNewChurchService;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=CreateNewChurchService.js.map
