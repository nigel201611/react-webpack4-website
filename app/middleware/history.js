import { useRouterHistory } from "react-router";
import createHashHistory from "history/lib/createHashHistory";

// export default useRouterHistory(createHashHistory)()
const history = useRouterHistory(createHashHistory)({});
history.listen(function (record) {
  //   console.log(record);
});
export default history;
