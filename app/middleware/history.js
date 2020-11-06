import { useRouterHistory } from "react-router";
import createHashHistory from "history/lib/createHashHistory";

// export default useRouterHistory(createHashHistory)()
const history = useRouterHistory(createHashHistory)({});
// history.listen((record) => {
//   // console.log(record);
//   console.log("history record");
// });
export default history;
