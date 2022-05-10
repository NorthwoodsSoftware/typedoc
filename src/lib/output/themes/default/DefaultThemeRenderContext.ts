import * as FS from "fs";

import type { RendererHooks } from "../..";
import type { ReferenceType, Reflection, CommentTag, DeclarationReflection } from "../../../models";
import type { Options } from "../../../utils";
import type { DefaultTheme } from "./DefaultTheme";
import { defaultLayout } from "./layouts/default";
import { index } from "./partials";
import { analytics } from "./partials/analytics";
import { breadcrumb } from "./partials/breadcrumb";
import { comment } from "./partials/comment";
import { footer } from "./partials/footer";
import { header } from "./partials/header";
import { hierarchy } from "./partials/hierarchy";
import { inherited } from "./partials/inherited";
import { member } from "./partials/member";
import { memberDeclaration } from "./partials/member.declaration";
import { memberGetterSetter } from "./partials/member.getterSetter";
import { memberReference } from "./partials/member.reference";
import { memberSignatureBody } from "./partials/member.signature.body";
import { memberSignatureTitle } from "./partials/member.signature.title";
import { memberSignatures } from "./partials/member.signatures";
import { memberSources } from "./partials/member.sources";
import { members } from "./partials/members";
import { membersGroup } from "./partials/members.group";
import { navigation } from "./partials/navigation";
import { parameter } from "./partials/parameter";
import { type } from "./partials/type";
import { typeAndParent } from "./partials/typeAndParent";
import { typeParameters } from "./partials/typeParameters";
import { indexTemplate } from "./templates";
import { reflectionTemplate } from "./templates/reflection";

function bind<F, L extends any[], R>(fn: (f: F, ...a: L) => R, first: F) {
    return (...r: L) => fn(first, ...r);
}

export class DefaultThemeRenderContext {
    options: Options;
    private validTags: string[] = ["override", "see", "since"];

    constructor(private theme: DefaultTheme, options: Options) {
        this.options = options;
    }

    hook = (name: keyof RendererHooks) =>
        this.theme.owner.hooks.emit(name, this);

    /** Avoid this in favor of urlTo if possible */
    relativeURL = (url: string | undefined) => {
        return url ? this.theme.markedPlugin.getRelativeUrl(url) : url;
    };

    urlTo = (reflection: Reflection) => this.relativeURL(reflection.url);

    markdown = (md: string | undefined) => {
        return md ? this.theme.markedPlugin.parseMarkdown(md) : "";
    };

    attemptExternalResolution = (type: ReferenceType) => {
        return this.theme.owner.attemptExternalResolution(type);
    };

    // check if this declaration contains a particular tag
	containsTag = (value: string, declaration: DeclarationReflection) => {
		let tags: CommentTag[] = [];
		if (declaration?.signatures) {
			// pull the tags from the signatures if they exist
			declaration.signatures.forEach(s => {
				if (s.comment?.tags) {
					tags = tags.concat(s.comment.tags);
				}
			});
		} else if (declaration?.comment?.tags) {
			// otherwise pull from the declaration itself
			tags = tags.concat(declaration.comment.tags);
		}

		const tagNames = tags.map(t => {
			if (t) {
				return t.tagName;
			}
			return false;
		});
        return tagNames.indexOf(value) > -1;
	}

    // check if this declaration has a tag from the list of valid tags
    hasValidTag = (tags: CommentTag[]) => {
        for (let i = 0; i < tags.length; i++) {
            if (this.validTags.indexOf(tags[i].tagName) > -1) return true;
        }
        return false;
    }

    // check if a particular tag is in the list of valid tags
    isValidTag = (tag: string) => {
        return this.validTags.indexOf(tag) > -1;
    }

    // check if a property (aka accessor) is readonly
	isReadOnly = (declaration: DeclarationReflection) => {
		if (declaration.kindString === "Accessor" && declaration.getSignature && !declaration.setSignature) {
			return true;
		}
        return false;
	}

    getVersion = () => {
		var ver = "";
		if (FS.existsSync('version.txt')) ver = FS.readFileSync('version.txt', 'utf8');
		if (ver) {
			return "<br/>version " + ver;
		}
		return "";
	}

    reflectionTemplate = bind(reflectionTemplate, this);
    indexTemplate = bind(indexTemplate, this);
    defaultLayout = bind(defaultLayout, this);

    analytics = bind(analytics, this);
    breadcrumb = bind(breadcrumb, this);
    comment = bind(comment, this);
    footer = bind(footer, this);
    header = bind(header, this);
    hierarchy = bind(hierarchy, this);
    index = bind(index, this);
    inherited = bind(inherited, this);
    member = bind(member, this);
    memberDeclaration = bind(memberDeclaration, this);
    memberGetterSetter = bind(memberGetterSetter, this);
    memberReference = bind(memberReference, this);
    memberSignatureBody = bind(memberSignatureBody, this);
    memberSignatureTitle = bind(memberSignatureTitle, this);
    memberSignatures = bind(memberSignatures, this);
    memberSources = bind(memberSources, this);
    members = bind(members, this);
    membersGroup = bind(membersGroup, this);
    navigation = bind(navigation, this);
    parameter = bind(parameter, this);
    type = bind(type, this);
    typeAndParent = bind(typeAndParent, this);
    typeParameters = bind(typeParameters, this);
}
