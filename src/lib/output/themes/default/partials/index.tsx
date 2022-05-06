import { wbr } from "../../lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX } from "../../../../utils";
import type { ContainerReflection, ReflectionCategory } from "../../../../models";

function renderCategory(context: DefaultThemeRenderContext, item: ReflectionCategory, appendName = "") {
    if (item.title === "Type") return;
    return (
        <section class="tsd-index-section">
            {!context.options.getValue("hideGoJSNav") && (<h3>{appendName ? `${item.title} ${appendName}` : item.title}</h3>)}
            <ul class="tsd-index-list">
                {item.children.map((item) => (
                    !context.containsTag("unindexed", item) && (
                        <li class={item.cssClasses}>
                            <a href={context.urlTo(item)} class="tsd-kind-icon">
                                {item.name ? wbr(item.name) : <em>{wbr(item.kindString!)}</em>}
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </section>
    );
}

export function index(context: DefaultThemeRenderContext, props: ContainerReflection) {
    if (props.categories && props.categories.length) {
        return (
            <section class="tsd-panel-group tsd-index-group">
                <h2>{context.options.getValue("indexTitle")}</h2>
                <section class="tsd-panel tsd-index-panel">
                    <div class="tsd-index-content">{props.categories.map((item) => renderCategory(context, item, "Classes"))}</div>
                </section>
            </section>
        );
    }

    if (props.groups && props.groups.length) {
        return (
            <section class="tsd-panel-group tsd-index-group">
                <h2>Index</h2>
                <section class="tsd-panel tsd-index-panel">
                    <div class="tsd-index-content">
                        {props.groups.map((item) => (
                            <section class={"tsd-index-section " + item.cssClasses}>
                                {item.categories ? (
                                    item.categories.map((item2) => renderCategory(context, item2, item.title))
                                ) : (
                                    <>
                                        <h3>{item.title}</h3>
                                        <ul class="tsd-index-list">
                                            {item.children.map((item) => (
                                                !context.containsTag("unindexed", item) && (
                                                    <li class={item.cssClasses}>
                                                        <a href={context.urlTo(item)} class="tsd-kind-icon">
                                                            {item.name ? wbr(item.name) : <em>{wbr(item.kindString!)}</em>}
                                                        </a>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </section>
                        ))}
                    </div>
                </section>
            </section>
        );
    }
}
