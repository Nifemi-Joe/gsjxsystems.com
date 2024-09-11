import * as React from "react";
import { RouteConstant } from "../../util/constant/RouteConstant.js";
import WalletView from "../../views/WalletView";
import CardView from "../../views/CardView";
import FinanceChartView from "../../views/FinanceChartView";

/** @type {RouteType[]} */
export const dashboardRoutes = [
	{
		path: RouteConstant.dashboard.home.path,
		name: RouteConstant.dashboard.home.name,
		element: <WalletView />,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.card.path,
		name: RouteConstant.dashboard.card.name,
		element: <CardView />,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.finance.path,
		name: RouteConstant.dashboard.finance.name,
		element: <FinanceChartView />,
		metadata: { isProtected: false }
	},
	// {
	// 	path: RouteConstant.dashboard.library.path,
	// 	name: RouteConstant.dashboard.library.name,
	// 	element: <Library />,
	// 	metadata: { isProtected: false }
	// },
];
