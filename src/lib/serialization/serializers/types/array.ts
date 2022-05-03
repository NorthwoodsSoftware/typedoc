import { ArrayType } from "../../../models";

import { TypeSerializerComponent } from "../../components";
import type { ArrayType as JSONArrayType } from "../../schema";

export class ArrayTypeSerializer extends TypeSerializerComponent<ArrayType> {
    supports(t: unknown) {
        return t instanceof ArrayType;
    }

    /**
     * Will be run after {@link TypeSerializer} so `type` will already be set.
     * @param type
     * @param obj
     */
    toObject(type: ArrayType, obj: Pick<JSONArrayType, "type">): JSONArrayType {
        return {
            ...obj,
            elementType: this.owner.toObject(type.elementType),
        };
    }
}
