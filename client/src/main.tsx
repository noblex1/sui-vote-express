
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SuiClientProvider, SuiClientProviderProps } from "@mysten/dapp-kit";

const networks: SuiClientProviderProps<any>["networks"] = {
	testnet: {
		url: "https://fullnode.testnet.sui.io:443",
	},
};

createRoot(document.getElementById("root")!).render(
	<SuiClientProvider networks={networks} network="testnet">
		<App />
	</SuiClientProvider>
);
