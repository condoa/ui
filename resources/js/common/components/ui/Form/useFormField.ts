import { FieldContextKey, useFieldError, useIsFieldDirty, useIsFieldTouched, useIsFieldValid } from 'vee-validate'
import { inject, ref } from 'vue'
import { FORM_ITEM_INJECTION_KEY } from './keys'

export function useFormField() {
    const fieldContext = inject(FieldContextKey, null)
    const fieldItemContext = inject(FORM_ITEM_INJECTION_KEY, null)
    const id = fieldItemContext ?? 'form'

    // When outside VeeValidate Field context, return safe defaults
    // This happens when Label/Description are rendered before Field in the DOM
    if (!fieldContext) {
        return {
            id,
            name: undefined,
            formItemId: `${id}-form-item`,
            formDescriptionId: `${id}-form-item-description`,
            formMessageId: `${id}-form-item-message`,
            valid: ref(true),
            isDirty: ref(false),
            isTouched: ref(false),
            error: ref<string | undefined>(undefined),
        }
    }

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        valid: useIsFieldValid(),
        isDirty: useIsFieldDirty(),
        isTouched: useIsFieldTouched(),
        error: useFieldError(),
    }
}
