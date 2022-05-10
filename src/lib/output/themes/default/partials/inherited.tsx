import { wbr } from "../../lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX } from "../../../../utils";
import type { DeclarationReflection } from "../../../../models";

export function inherited(context: DefaultThemeRenderContext, props: DeclarationReflection) {
    if (props.inheritedMembers && props.inheritedMembers.length) {
        return (
            <section class="tsd-panel-group tsd-index-group tsd-is-inherited">
                <h2>Inherited Members</h2>
                <section class="tsd-panel tsd-index-panel">
                    <div class="tsd-index-content">
                        {props.inheritedMembers.map((item) => (
                            <section class={"tsd-index-section " + item.cssClasses}>
                                <h3>{item.title}</h3>
                                <ul class="tsd-index-list">
                                    {item.children.map((item) => (
                                        !context.containsTag("unindexed", item) && (
                                            <li class={item.cssClasses}>
                                                <a href={context.urlTo(item)} class="tsd-kind-icon">
                                                    {item.getFriendlyFullName() ? wbr(item.getFriendlyFullName()) : <em>{wbr(item.kindString!)}</em>}
                                                </a>
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                </section>
            </section>
        );
    }
}
