export const links = {
  cnbProject: "https://cnb.cool/ETS2LA-CN/Euro-Truck-Simulator-2-Lane-Assist",
  releases:
    "https://cnb.cool/ETS2LA-CN/Euro-Truck-Simulator-2-Lane-Assist/-/releases",
  windows:
    "https://cnb.cool/ETS2LA-CN/Euro-Truck-Simulator-2-Lane-Assist/-/releases/latest/download/ETS2LA-win-release.msi",
  linux:
    "https://cnb.cool/ETS2LA-CN/Euro-Truck-Simulator-2-Lane-Assist/-/releases/latest/download/ETS2LA-linux-release.AppImage",
  docs: "https://docs.ets2la.cn",
  community: "https://www.kookapp.cn/app/invite/VZaUPP",
  github: "https://github.com/ETS2LA/ETS2LA",
  icp: "https://beian.miit.gov.cn/",
  police:
    "https://beian.mps.gov.cn/#/query/webSearch?code=32120202010796",
} as const;

export const features = [
  {
    icon: "download",
    title: "国内下载更直接",
    description: "Windows 与 Linux 安装包均从 CNB 国内镜像获取，减少寻找可用下载入口的时间。",
    link: links.releases,
    linkLabel: "查看全部发布",
  },
  {
    icon: "book",
    title: "中文指引更清晰",
    description: "安装、初始化、配置与使用说明集中整理，按中文文档逐步完成设置。",
    link: links.docs,
    linkLabel: "阅读中文文档",
  },
  {
    icon: "chat",
    title: "国内社区更易抵达",
    description: "在 KOOK 与其他玩家和开发者交流使用经验，获取国内社区支持。",
    link: links.community,
    linkLabel: "加入 KOOK 社区",
  },
  {
    icon: "code",
    title: "来源公开可核验",
    description: "代码与发布记录公开可查，同时保留国内镜像和官方仓库入口。",
    link: links.cnbProject,
    linkLabel: "访问国内代码镜像",
  },
] as const;

export const steps = [
  {
    number: "01",
    title: "选择安装包",
    description: "根据操作系统下载 Windows MSI 或 Linux AppImage。本站始终指向最新发布版本。",
  },
  {
    number: "02",
    title: "按文档完成安装",
    description: "运行安装程序，并依照中文文档完成初始化、游戏配置和所需功能设置。",
  },
  {
    number: "03",
    title: "开始驾驶并获得支持",
    description: "在软件中启用所需功能。遇到问题时先查文档，也可以到 KOOK 社区交流。",
  },
] as const;

export const faqs = [
  {
    question: "ETS2LA 是什么？",
    answer:
      "ETS2LA 是一个面向 SCS 卡车模拟游戏的开源项目，提供车道辅助、地图和注重隐私的行车记录仪等功能。本站由国内用户独立运营，并在开发者监督下提供国内下载、文档与社区入口。",
  },
  {
    question: "ETS2LA 收费吗？",
    answer:
      "软件可以免费从国内镜像下载，下载本身无需注册，也不需要提供银行卡信息。你可以直接获取最新安装包并查看公开源代码。",
    link: links.windows,
    linkLabel: "获取最新安装包",
  },
  {
    question: "支持哪些操作系统？",
    answer:
      "目前提供 Windows MSI 和 Linux AppImage。Linux 版本需要 GLIBC 2.43；如果发行版未提供该版本，请参考项目文档选择适合的方式。",
    link: links.releases,
    linkLabel: "查看发布文件",
  },
  {
    question: "国内镜像和国际源有什么区别？",
    answer:
      "国内站默认从 CNB 获取安装包，国际站主要使用 GitHub。本站只提供最新版本直链，需要历史版本时可以查看国内镜像的完整发布记录。",
    link: links.releases,
    linkLabel: "查看历史发布",
  },
  {
    question: "如何确认游戏版本是否兼容？",
    answer:
      "ETS2LA 与游戏版本相关。安装前请查看最新发布说明和中文文档中的兼容信息，确认你的游戏版本受到支持后再继续。",
    link: links.docs,
    linkLabel: "查阅中文文档",
  },
  {
    question: "安装或使用遇到问题怎么办？",
    answer:
      "建议先查阅中文文档和本站常见问题。如果仍未解决，可以加入国内 KOOK 社区，说明你的游戏版本、软件版本和遇到的具体情况。",
    link: links.community,
    linkLabel: "前往 KOOK 社区",
  },
] as const;
