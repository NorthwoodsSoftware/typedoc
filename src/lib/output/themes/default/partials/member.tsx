import { renderFlags, wbr } from "../../lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX } from "../../../../utils";
import { DeclarationReflection, ReferenceReflection } from "../../../../models";

export const member = (context: DefaultThemeRenderContext, props: DeclarationReflection) => (
    <section class={"tsd-panel tsd-member " + props.cssClasses}>
        <a id={props.anchor} class="tsd-anchor"></a>
        {!!props.name && (
            <h3 class="tsd-anchor-link">
                {renderFlags(props.flags)}
                {context.isReadOnly(props) && (<span class={"tsd-flag ts-flagReadOnly"}>Read-only</span>)}
                {" "}
                {wbr(props.name)}
                {/* For properties (accessors in TypeDoc), print the type in the header */}
                {props.hasGetterOrSetter()
                    ? !!props.getSignature && (
                        !!props.getSignature.type && (
                            <>
                                <span class="tsd-signature-symbol">: </span>
                                {context.type(props.getSignature.type)}
                            </>
                        )
                    )
                    : !!props.type && (
                        <>
                            <span class="tsd-signature-symbol">: </span>
                            {context.type(props.type)}
                        </>
                    )
                }
            </h3>
        )}
        {props.signatures
            ? context.memberSignatures(props)
            : props.hasGetterOrSetter()
            ? context.memberGetterSetter(props)
            : props instanceof ReferenceReflection
            ? context.memberReference(props)
            : context.memberDeclaration(props)}

        {props.groups?.map((item) => item.children.map((item) => !item.hasOwnDocument && context.member(item)))}
    </section>
);
