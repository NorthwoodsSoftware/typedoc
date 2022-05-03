import type * as ts from "typescript";
import type { SomeType } from "..";
import { ReferenceType, ReflectionType, Type } from "../types";
import { TraverseCallback, TraverseProperty, Reflection } from "./abstract";
import { ContainerReflection } from "./container";
import type { SignatureReflection } from "./signature";
import type { TypeParameterReflection } from "./type-parameter";

/**
 * Stores hierarchical type data.
 *
 * @see {@link DeclarationReflection.typeHierarchy}
 */
export interface DeclarationHierarchy {
    /**
     * The types represented by this node in the hierarchy.
     */
    types: Type[];

    /**
     * The next hierarchy level.
     */
    next?: DeclarationHierarchy;

    /**
     * Is this the entry containing the target type?
     */
    isTarget?: boolean;
}

/**
 * A reflection that represents a single declaration emitted by the TypeScript compiler.
 *
 * All parts of a project are represented by DeclarationReflection instances. The actual
 * kind of a reflection is stored in its ´kind´ member.
 */
export class DeclarationReflection extends ContainerReflection {
    /**
     * The escaped name of this declaration assigned by the TS compiler if there is an associated symbol.
     * This is used to retrieve properties for analyzing inherited members.
     * @internal
     */
    escapedName?: ts.__String;

    /**
     * The type of the reflection.
     *
     * If the reflection represents a variable or a property, this is the value type.<br />
     * If the reflection represents a signature, this is the return type.
     */
    type?: SomeType;

    typeParameters?: TypeParameterReflection[];

    /**
     * A list of call signatures attached to this declaration.
     *
     * TypeDoc creates one declaration per function that may contain one or more
     * signature reflections.
     */
    signatures?: SignatureReflection[];

    /**
     * The index signature of this declaration.
     */
    indexSignature?: SignatureReflection;

    /**
     * The get signature of this declaration.
     */
    getSignature?: SignatureReflection;

    /**
     * The set signature of this declaration.
     */
    setSignature?: SignatureReflection;

    /**
     * The default value of this reflection.
     *
     * Applies to function parameters.
     */
    defaultValue?: string;

    /**
     * A type that points to the reflection that has been overwritten by this reflection.
     *
     * Applies to interface and class members.
     */
    overwrites?: ReferenceType;

    /**
     * A type that points to the reflection this reflection has been inherited from.
     *
     * Applies to interface and class members.
     */
    inheritedFrom?: ReferenceType;

    /**
     * A type that points to the reflection this reflection is the implementation of.
     *
     * Applies to class members.
     */
    implementationOf?: ReferenceType;

    /**
     * A list of all types this reflection extends (e.g. the parent classes).
     */
    extendedTypes?: Type[];

    /**
     * A list of all types that extend this reflection (e.g. the subclasses).
     */
    extendedBy?: ReferenceType[];

    /**
     * A list of all types this reflection implements.
     */
    implementedTypes?: Type[];

    /**
     * A list of all types that implement this reflection.
     */
    implementedBy?: ReferenceType[];

    /**
     * Contains a simplified representation of the type hierarchy suitable for being
     * rendered in templates.
     */
    typeHierarchy?: DeclarationHierarchy;

    override hasGetterOrSetter(): boolean {
        return !!this.getSignature || !!this.setSignature;
    }

    getAllSignatures(): SignatureReflection[] {
        let result: SignatureReflection[] = [];

        if (this.signatures) {
            result = result.concat(this.signatures);
        }
        if (this.indexSignature) {
            result.push(this.indexSignature);
        }
        if (this.getSignature) {
            result.push(this.getSignature);
        }
        if (this.setSignature) {
            result.push(this.setSignature);
        }

        return result;
    }

    /** @internal */
    getNonIndexSignatures(): SignatureReflection[] {
        return ([] as SignatureReflection[]).concat(
            this.signatures ?? [],
            this.setSignature ?? [],
            this.getSignature ?? []
        );
    }

    /**
     * @param name  The name to look for. Might contain a hierarchy.
     */
     override findReflectionByName(name: string, searchUp?: boolean): Reflection;

     /**
      * @param names  The name hierarchy to look for.
      */
     override findReflectionByName(names: string[], searchUp?: boolean): Reflection;
 
     /**
      * Try to find a reflection by its name.
      * For DeclarationReflections, walk up the parent type tree looking for the reflection.
      *
      * @return The found reflection or null.
      */
     override findReflectionByName(arg: any, searchUp?: boolean): Reflection | undefined {
         const names: string[] = Array.isArray(arg) ? arg : arg.split('.');
 
         function walkTypeParents(child: DeclarationReflection) {
             let parents = child.extendedTypes;
             if (parents) {
                 let firstParent = parents[0] as ReferenceType;
                 let parentReflection = firstParent.reflection as DeclarationReflection;
                 if (parentReflection) {
                     const ref = parentReflection.findReflectionByName(names, searchUp);
                     if (ref) {
                         return ref;
                     }
                 }
             }
             return null;
         }
 
         const reflection = this.getChildByName(names);
         if (reflection) {
             return reflection;
         } else {
             if (searchUp && this.extendedTypes) {
                 const inheritedReflection = walkTypeParents(this);
                 if (inheritedReflection !== null) {
                     return inheritedReflection;
                 }
             }
             return this.parent?.findReflectionByName(names);
         }
     }

    /**
     * Traverse all potential child reflections of this reflection.
     *
     * The given callback will be invoked for all children, signatures and type parameters
     * attached to this reflection.
     *
     * @param callback  The callback function that should be applied for each child reflection.
     */
    override traverse(callback: TraverseCallback) {
        for (const parameter of this.typeParameters?.slice() || []) {
            if (callback(parameter, TraverseProperty.TypeParameter) === false) {
                return;
            }
        }

        if (this.type instanceof ReflectionType) {
            if (
                callback(
                    this.type.declaration,
                    TraverseProperty.TypeLiteral
                ) === false
            ) {
                return;
            }
        }

        for (const signature of this.signatures?.slice() || []) {
            if (callback(signature, TraverseProperty.Signatures) === false) {
                return;
            }
        }

        if (this.indexSignature) {
            if (
                callback(
                    this.indexSignature,
                    TraverseProperty.IndexSignature
                ) === false
            ) {
                return;
            }
        }

        if (this.getSignature) {
            if (
                callback(this.getSignature, TraverseProperty.GetSignature) ===
                false
            ) {
                return;
            }
        }

        if (this.setSignature) {
            if (
                callback(this.setSignature, TraverseProperty.SetSignature) ===
                false
            ) {
                return;
            }
        }

        super.traverse(callback);
    }

    /**
     * Return a string representation of this reflection.
     */
    override toString(): string {
        let result = super.toString();

        if (this.typeParameters) {
            const parameters: string[] = [];
            this.typeParameters.forEach((parameter) => {
                parameters.push(parameter.name);
            });
            result += "<" + parameters.join(", ") + ">";
        }

        if (this.type) {
            result += ":" + this.type.toString();
        }

        return result;
    }
}
