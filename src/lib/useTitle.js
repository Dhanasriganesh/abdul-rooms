import { useEffect } from "react";

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Wohnbrücke` : "Wohnbrücke · Room mediation in Germany";
  }, [title]);
}
