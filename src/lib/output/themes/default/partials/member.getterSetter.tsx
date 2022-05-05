import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX } from "../../../../utils";
import type { DeclarationReflection } from "../../../../models";

export const memberGetterSetter = (context: DefaultThemeRenderContext, props: DeclarationReflection) => (
    <>
        <ul class="tsd-descriptions">
            {!!props.getSignature && <li class="tsd-description">{context.memberSignatureBody(props.getSignature)}</li>}
            {!!props.setSignature && <li class="tsd-description">{context.memberSignatureBody(props.setSignature)}</li>}
        </ul>
    </>
);
