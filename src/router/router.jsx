
import { Route, Routes} from "react-router-dom";
import {dashboardRoutes} from "./routes/dashboardRoutes.jsx";
import { AnimatePresence, motion } from'framer-motion';
const pageTransition = {
	initial: { opacity: 0,  },
	animate: { opacity: 1, },
	exit: { opacity: 0, },
	transition: { duration: 1 }
};

export const Router = () => {
	const routes = [...dashboardRoutes]
	const publicRoute  =  routes.filter(it => !it.metadata.isProtected)
	const privateRoute  =  routes.filter(it => it.metadata.isProtected)
	console.log(publicRoute)
	console.log(privateRoute)
	return(
		<AnimatePresence mode="wait">
			<Routes>
				{(publicRoute).map(route => <Route key={route.path} path={route.path} element={<motion.div {...pageTransition}>{route.element}</motion.div>} />)}
				{/*{(privateRoute).map(route => StringUtil.isSuccess(authState.userInfo.responseCode)?*/}
				{/*    <Route key={route.path} path={route.path} element={route.element}/>:<Route*/}
				{/*        key={route.path}*/}
				{/*        path={route.path}*/}
				{/*        element={<Navigate to="/" replace />}*/}
				{/*    />*/}
				{/*)}*/}
			</Routes>
		</AnimatePresence>
	)
}