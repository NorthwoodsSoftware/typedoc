import { hasTypeParameters } from "../../lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import type { PageEvent } from "../../../events";
import { ContainerReflection, DeclarationReflection, ReflectionType } from "../../../../models";
import { JSX } from "../../../../utils";

export const reflectionTemplate = (context: DefaultThemeRenderContext, props: PageEvent<ContainerReflection>) => (
    <>
        {props.model.flags.isExtension && (
            <section class="tsd-panel tsd-extension">
                <p>
                    This is an extension and not part of the main GoJS library.
                    Note that the API for this class may change at any time.
                    If you intend to use an extension in production, you should copy the code to your own source directory.
                    Extensions can be found in the GoJS kit under the <code>extensions</code> (for loading via script tags),
                    <code>extensionsTS</code> (UMD modules), or <code>extensionsJSM</code> (ES6 modules) folders.
                    See the <a href={context.relativeURL("../intro/extensions.html")}>Extensions intro page</a> for more information.
                </p>
            </section>
        )}

        {props.model.flags.isStorage && (
            <section class="tsd-panel tsd-extension">
                <p>
                    This is part of GoCloudStorage and not part of the main GoJS library.
                    Storage can be found in the GoJS kit under the <code>projects</code> folder.
                    See the <a href={context.relativeURL("../intro/storage.html")}>Storage intro page</a> for more information.
                </p>
            </section>
        )}

        {props.model instanceof DeclarationReflection && !!props.model.typeHierarchy && (
            <section class="tsd-panel tsd-hierarchy">
                <h3>Hierarchy</h3>
                {context.hierarchy(props.model.typeHierarchy)}
            </section>
        )}

        {props.model.hasComment() && <section class="tsd-panel tsd-comment">{context.comment(props.model)}</section>}

        {hasTypeParameters(props.model) && (
            <section class="tsd-panel tsd-type-parameters">
                <h3>Type parameters</h3>
                {context.typeParameters(props.model.typeParameters)}
            </section>
        )}
        {props.model instanceof DeclarationReflection && (
            <>
                {!!props.model.implementedTypes && (
                    <section class="tsd-panel">
                        <h3>Implements</h3>
                        <ul class="tsd-hierarchy">
                            {props.model.implementedTypes.map((item) => (
                                <li>{context.type(item)}</li>
                            ))}
                        </ul>
                    </section>
                )}
                {!!props.model.implementedBy && (
                    <section class="tsd-panel">
                        <h3>Implemented by</h3>
                        <ul class="tsd-hierarchy">
                            {props.model.implementedBy.map((item) => (
                                <li>{context.type(item)}</li>
                            ))}
                        </ul>
                    </section>
                )}
                {!!props.model.signatures && (
                    <section class="tsd-panel">
                        <h3 class="tsd-before-signature">Callable</h3>
                        {context.memberSignatures(props.model)}
                    </section>
                )}
                {!!props.model.indexSignature && (
                    <section class={"tsd-panel " + props.model.cssClasses}>
                        <h3 class="tsd-before-signature">Indexable</h3>
                        <div class="tsd-signature tsd-kind-icon">
                            <span class="tsd-signature-symbol">[</span>
                            {props.model.indexSignature.parameters!.map((item) => (
                                <>
                                    {item.name}: {context.type(item.type)}
                                </>
                            ))}
                            <span class="tsd-signature-symbol">{"]: "}</span>
                            {context.type(props.model.indexSignature.type)}
                        </div>
                        {context.comment(props.model.indexSignature)}
                        {props.model.indexSignature?.type instanceof ReflectionType &&
                            context.parameter(props.model.indexSignature.type.declaration)}
                    </section>
                )}
            </>
        )}
        {context.index(props.model)}
        {props.model instanceof DeclarationReflection && !!props.model.inheritedMembers && (
            <>
                {context.inherited(props.model)}
            </>
        )}
        {context.members(props.model)}
    </>
);
