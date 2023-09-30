const Profile = () => import("../modules/Profile/Profile.vue");
const Dashboard = () => import("../modules/Dashboard/Dashboard.vue");
const Payment = () => import("../modules/Payment/Payment.vue");
const Projects = () => import("../modules/Projects/Projects.vue");
const Accounts = () => import("../modules/Accounts/Accounts.vue");
const AccountsDetail = () =>
  import("../modules/Accounts/AccountsDetail.vue");
const Moderation = () =>
  import("../modules/Moderation/Moderation.vue");
const Info = () => import("../modules/Info/Info.vue");
const Creatives = () => import("../modules/Creatives/Creatives.vue");
const Mediabuying = () =>
  import("../modules/MediaBuying/Mediabuying.vue");
const Chats = () => import("@/modules/Chats/Chats.vue");
const ChatsDetail = () => import("@/modules/Chats/ChatsDetail.vue");

const MainRoutes = [
  {
    path: "profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "dashboard",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "payment",
    name: "payment",
    component: Payment,
  },
  {
    path: "projects",
    name: "projects",
    component: Projects,
  },
  {
    path: "accounts",
    name: "accounts",
    component: Accounts,
  },
  {
    path: "accounts/:id",
    name: "account",
    component: AccountsDetail,
  },
  {
    path: "moderation",
    name: "moderation",
    component: Moderation,
  },
  {
    path: "info",
    name: "info",
    component: Info,
  },
  {
    path: "creatives",
    name: "creatives",
    component: Creatives,
  },
  {
    path: "mediabuying",
    name: "mediabuying",
    component: Mediabuying,
  },
  {
    path: "chats",
    name: "chats",
    component: Chats,
  },
  {
    path: "chats/:id",
    name: "chat",
    component: ChatsDetail,
  },
];

export default MainRoutes;
