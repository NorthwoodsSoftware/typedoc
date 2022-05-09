import { Application, registerComponent } from "./typedoc/Application";
import { MenuHighlight } from "./typedoc/components/MenuHighlight";
import { initSearch } from "./typedoc/components/Search";
import { Signature } from "./typedoc/components/Signature";
import { Toggle } from "./typedoc/components/Toggle";
import { Filter } from "./typedoc/components/Filter";
import { initTheme } from "./typedoc/Theme";

initSearch();

// formerly in api.js
var hash = null;
function changeHash() {
    var panels = document.getElementsByClassName("tsd-panel");
    for (let i = 0; i < panels.length; i++) {
        var p = panels[i];
        p.classList.remove("targeted");
    }
    hash = window.location.hash.slice(1);
    if (hash) {
        var elt = document.getElementById(hash);
        if (elt) (elt.parentNode as any).classList.add("targeted");
    }
}
document.addEventListener("DOMContentLoaded", changeHash);
window.addEventListener("hashchange", changeHash);

registerComponent(MenuHighlight, ".menu-highlight");
registerComponent(Signature, ".tsd-signatures");
registerComponent(Toggle, "a[data-toggle]");

if (Filter.isSupported()) {
    registerComponent(Filter, "#tsd-filter");
} else {
    document.documentElement.classList.add("no-filter");
}

const themeChoice = document.getElementById("theme");
if (themeChoice) {
    initTheme(themeChoice as HTMLOptionElement);
}

const app: Application = new Application();

Object.defineProperty(window, "app", { value: app });
