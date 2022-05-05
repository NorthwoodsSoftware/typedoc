import type { Reflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { PageEvent } from "../../../events";
import { classNames } from "../../lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export function footer(context: DefaultThemeRenderContext, props: PageEvent<Reflection>) {
    const hideLegend = context.options.getValue("hideLegend");
    const hideGenerator = context.options.getValue("hideGenerator");
    return (
        <>
            <div class="tsd w-full max-w-screen-xl mx-auto px-2">
                <div class="bottom-copyright">Copyright &copy; 1998-2022 by Northwoods Software Corporation.</div>
            </div>
            <footer
                class={classNames({
                    "with-border-bottom": !hideGenerator,
                })}
            >
                <div class="tsd w-full max-w-screen-xl mx-auto px-2">
                    {!hideLegend && props.legend?.length && (
                        <>
                            <h2>Legend</h2>
                            <div class="tsd-legend-group">
                                {props.legend.map((item) => (
                                    <ul class="tsd-legend">
                                        {item.map((item) => (
                                            <li class={item.classes.join(" ")}>
                                                <span class="tsd-kind-icon">{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ))}
                            </div>
                        </>
                    )}

                    <h2>Settings</h2>
                    <p>
                        Theme{" "}
                        <select id="theme">
                            <option value="os">OS</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </p>
                </div>
            </footer>

            {!hideGenerator && (
                <div class="tsd w-full max-w-screen-xl mx-auto tsd-generator">
                    <p>
                        {"Generated using "}
                        <a href="https://typedoc.org/" target="_blank">
                            TypeDoc
                        </a>
                    </p>
                </div>
            )}
        </>
    );
}
