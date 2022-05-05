import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX, Raw } from "../../../../utils";
import type { Reflection } from "../../../../models";

export function comment(context: DefaultThemeRenderContext, props: Reflection) {
    if (!props.comment?.hasVisibleComponent()) return;

    return (
        <div class="tsd-comment tsd-typography">
            {!!props.comment.shortText && (
                <Raw html={"\n" + context.markdown(props.comment.shortText)} />
            )}
            {!!props.comment.text && (
                <div>
                    <Raw html={context.markdown(props.comment.text)} />
                </div>
            )}
            {props.comment.tags?.length > 0 && context.hasValidTag(props.comment.tags) && (
                <dl class="tsd-comment-tags">
                    {props.comment.tags.map((item) => (
                        context.isValidTag(item.tagName) && (
                            <>
                                <dt class={item.tagName === "override" ? "override" : ""}>
                                    {item.tagName}
                                    {item.paramName ? ` ${item.paramName}` : ""}
                                </dt>
                                <dd>
                                    <Raw html={context.markdown(item.text)} />
                                </dd>
                            </>
                         )
                    ))}
                </dl>
            )}
        </div>
    );
}
