import { Inter, Lusitana, Montserrat } from "next/font/google";

export const lusitana = Lusitana({ subsets: ["latin"], weight: "400" });

export const inter = Inter({ subsets: ["latin"] });

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
});
