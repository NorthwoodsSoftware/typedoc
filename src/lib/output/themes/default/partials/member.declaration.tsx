import { DeclarationReflection, ReflectionType } from "../../../../models";
import { JSX } from "../../../../utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export const memberDeclaration = (context: DefaultThemeRenderContext, props: DeclarationReflection) => (
    <>
        {context.comment(props)}

        {!!props.typeParameters && (
            <>
                <h4 class="tsd-type-parameters-title">Type parameters</h4>
                {context.typeParameters(props.typeParameters)}
            </>
        )}
        {props.type instanceof ReflectionType && (
            <div class="tsd-type-declaration">
                <h4>Type declaration</h4>
                {context.parameter(props.type.declaration)}
            </div>
        )}
    </>
);
