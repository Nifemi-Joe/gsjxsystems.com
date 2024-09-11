
import { Route, Routes} from "react-router-dom";
import {dashboardRoutes} from "./routes/dashboardRoutes.jsx";

export const Router = () => {
	const routes = [...dashboardRoutes]
	const publicRoute  =  routes.filter(it => !it.metadata.isProtected)
	const privateRoute  =  routes.filter(it => it.metadata.isProtected)
	console.log(publicRoute)
	console.log(privateRoute)
	return(
		<Routes>
			{(publicRoute).map(route => <Route key={route.path} path={route.path} element={route.element} />)}
			{/*{(privateRoute).map(route => StringUtil.isSuccess(authState.userInfo.responseCode)?*/}
			{/*    <Route key={route.path} path={route.path} element={route.element}/>:<Route*/}
			{/*        key={route.path}*/}
			{/*        path={route.path}*/}
			{/*        element={<Navigate to="/" replace />}*/}
			{/*    />*/}
			{/*)}*/}
		</Routes>
	)
}