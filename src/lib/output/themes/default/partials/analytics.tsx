import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX } from "../../../../utils";

export function analytics(context: DefaultThemeRenderContext) {
    const gaID = context.options.getValue("gaID");
    if (!gaID) return;

    const script = `
      <script async src="https://www.googletagmanager.com/gtag/js?id=${gaID}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date()); gtag('config', '${gaID}');
        var getOutboundLink = function(url, label) {
            gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': label,
            'transport_type': 'beacon'
            });
        }
        // topnav
        var topButton = document.getElementById("topnavButton");
        var topnavList = document.getElementById("topnavList");
        topButton.addEventListener("click", function() {
            this.classList.toggle("active");
            topnavList.classList.toggle("hidden");
            document.getElementById("topnavOpen").classList.toggle("hidden");
            document.getElementById("topnavClosed").classList.toggle("hidden");
        });

        document.getElementById("contactBtn").addEventListener("click", function() {
            getOutboundLink('https://www.nwoods.com/contact.html', 'contact');
        });

        document.getElementById("buyBtn").addEventListener("click", function() {
            getOutboundLink('https://www.nwoods.com/sales/index.html', 'buy');
        });
      </script>`.trim();

    return (
      <JSX.Raw html={script} />
    );
}
