<script setup lang="ts">
import Icon from '@/common/components/Icon.vue'
import Input from '../Input.vue'
import InputControl from '../InputControl.vue'
import { formHintVariants } from '../Form/variants'
import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js'
import { AnimatePresence, motion } from 'motion-v'
import { useField } from 'vee-validate'
import { computed, ref, useId, watch } from 'vue'

/**
 * ISO 3166-1 alpha-2 to primary CLDR locale code. Used with `Intl.DisplayNames`
 * to render each country in its own language (endonym), so the picker shows
 * "Deutschland" / "France" / native names instead of localizing every country
 * to the viewer's current UI locale.
 */
const COUNTRY_LOCALES: Record<string, string> = {
    AC: 'en', AD: 'ca', AE: 'ar', AF: 'fa', AG: 'en', AI: 'en', AL: 'sq', AM: 'hy',
    AO: 'pt', AQ: 'en', AR: 'es', AS: 'en', AT: 'de', AU: 'en', AW: 'nl', AX: 'sv',
    AZ: 'az',
    BA: 'bs', BB: 'en', BD: 'bn', BE: 'nl', BF: 'fr', BG: 'bg', BH: 'ar', BI: 'fr',
    BJ: 'fr', BL: 'fr', BM: 'en', BN: 'ms', BO: 'es', BQ: 'nl', BR: 'pt', BS: 'en',
    BT: 'dz', BV: 'no', BW: 'en', BY: 'be', BZ: 'en',
    CA: 'en', CC: 'en', CD: 'fr', CF: 'fr', CG: 'fr', CH: 'de', CI: 'fr', CK: 'en',
    CL: 'es', CM: 'fr', CN: 'zh', CO: 'es', CR: 'es', CU: 'es', CV: 'pt', CW: 'nl',
    CX: 'en', CY: 'el', CZ: 'cs',
    DE: 'de', DJ: 'fr', DK: 'da', DM: 'en', DO: 'es', DZ: 'ar',
    EC: 'es', EE: 'et', EG: 'ar', EH: 'ar', ER: 'ti', ES: 'es', ET: 'am',
    FI: 'fi', FJ: 'en', FK: 'en', FM: 'en', FO: 'fo', FR: 'fr',
    GA: 'fr', GB: 'en', GD: 'en', GE: 'ka', GF: 'fr', GG: 'en', GH: 'en', GI: 'en',
    GL: 'kl', GM: 'en', GN: 'fr', GP: 'fr', GQ: 'es', GR: 'el', GS: 'en', GT: 'es',
    GU: 'en', GW: 'pt', GY: 'en',
    HK: 'zh', HM: 'en', HN: 'es', HR: 'hr', HT: 'fr', HU: 'hu',
    ID: 'id', IE: 'en', IL: 'he', IM: 'en', IN: 'hi', IO: 'en', IQ: 'ar', IR: 'fa',
    IS: 'is', IT: 'it',
    JE: 'en', JM: 'en', JO: 'ar', JP: 'ja',
    KE: 'sw', KG: 'ky', KH: 'km', KI: 'en', KM: 'ar', KN: 'en', KP: 'ko', KR: 'ko',
    KW: 'ar', KY: 'en', KZ: 'kk',
    LA: 'lo', LB: 'ar', LC: 'en', LI: 'de', LK: 'si', LR: 'en', LS: 'en', LT: 'lt',
    LU: 'lb', LV: 'lv', LY: 'ar',
    MA: 'ar', MC: 'fr', MD: 'ro', ME: 'sr', MF: 'fr', MG: 'mg', MH: 'en', MK: 'mk',
    ML: 'fr', MM: 'my', MN: 'mn', MO: 'zh', MP: 'en', MQ: 'fr', MR: 'ar', MS: 'en',
    MT: 'mt', MU: 'en', MV: 'dv', MW: 'en', MX: 'es', MY: 'ms', MZ: 'pt',
    NA: 'en', NC: 'fr', NE: 'fr', NF: 'en', NG: 'en', NI: 'es', NL: 'nl', NO: 'no',
    NP: 'ne', NR: 'en', NU: 'en', NZ: 'en',
    OM: 'ar',
    PA: 'es', PE: 'es', PF: 'fr', PG: 'en', PH: 'tl', PK: 'ur', PL: 'pl', PM: 'fr',
    PN: 'en', PR: 'es', PS: 'ar', PT: 'pt', PW: 'en', PY: 'es',
    QA: 'ar',
    RE: 'fr', RO: 'ro', RS: 'sr', RU: 'ru', RW: 'rw',
    SA: 'ar', SB: 'en', SC: 'fr', SD: 'ar', SE: 'sv', SG: 'en', SH: 'en', SI: 'sl',
    SJ: 'no', SK: 'sk', SL: 'en', SM: 'it', SN: 'fr', SO: 'so', SR: 'nl', SS: 'en',
    ST: 'pt', SV: 'es', SX: 'nl', SY: 'ar', SZ: 'en',
    TA: 'en', TC: 'en', TD: 'fr', TF: 'fr', TG: 'fr', TH: 'th', TJ: 'tg', TK: 'en',
    TL: 'pt', TM: 'tk', TN: 'ar', TO: 'en', TR: 'tr', TT: 'en', TV: 'en', TW: 'zh',
    TZ: 'sw',
    UA: 'uk', UG: 'en', UM: 'en', US: 'en', UY: 'es', UZ: 'uz',
    VA: 'it', VC: 'en', VE: 'es', VG: 'en', VI: 'en', VN: 'vi', VU: 'fr',
    WF: 'fr', WS: 'en',
    XK: 'sq',
    YE: 'ar', YT: 'fr',
    ZA: 'en', ZM: 'en', ZW: 'en',
}

interface Props {
    label?: string
    labelHint?: string
    hint?: string
    disabled?: boolean
    modelValue?: string
    name?: string
    id?: string
    rules?: any
    validateOnMount?: boolean
    placeholder?: string
    required?: boolean
    defaultCountry?: CountryCode
}

const props = withDefaults(defineProps<Props>(), {
    defaultCountry: 'BR',
})

defineOptions({ inheritAttrs: false })

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

const inputId = props.id || useId()
const errorId = `${inputId}-error`

const { errorMessage, value, handleBlur, handleChange } = useField<string>(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
})

const country = ref<CountryCode>(props.defaultCountry)
const national = ref<string>('')
const popoverOpen = ref(false)

const uiLocale = typeof document !== 'undefined' ? document.documentElement.lang || 'pt-BR' : 'pt-BR'
const uiDisplayNames = new Intl.DisplayNames([uiLocale], { type: 'region' })

const displayNamesCache = new Map<string, Intl.DisplayNames>()
function displayNamesFor(locale: string): Intl.DisplayNames {
    if (!displayNamesCache.has(locale)) {
        try {
            displayNamesCache.set(locale, new Intl.DisplayNames([locale], { type: 'region' }))
        } catch {
            displayNamesCache.set(locale, uiDisplayNames)
        }
    }
    return displayNamesCache.get(locale)!
}

function nativeName(iso: string): string {
    const locale = COUNTRY_LOCALES[iso] ?? 'en'
    return displayNamesFor(locale).of(iso) || iso
}

function flagClass(iso: string): string {
    return `fi fi-${iso.toLowerCase()}`
}

const countries = computed(() =>
    getCountries()
        .map((iso) => ({
            iso,
            name: nativeName(iso),
            localizedName: uiDisplayNames.of(iso) || iso,
            dial: '+' + getCountryCallingCode(iso),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
)

const dialCode = computed(() => '+' + getCountryCallingCode(country.value))

function emitE164() {
    const digits = national.value.replace(/\D/g, '')
    if (!digits) {
        if (value.value) handleChange('')
        return
    }
    const parsed = parsePhoneNumberFromString(digits, country.value)
    handleChange(parsed?.number || `${dialCode.value}${digits}`)
}

function onNationalInput(raw: string) {
    const formatter = new AsYouType(country.value)
    national.value = formatter.input(raw.replace(/[^\d+\-() ]/g, ''))
    emitE164()
}

function selectCountry(iso: CountryCode) {
    country.value = iso
    popoverOpen.value = false
    emitE164()
}

watch(
    () => props.modelValue,
    (next) => {
        if (!next) return
        if (next === value.value) return
        const parsed = parsePhoneNumberFromString(next)
        if (parsed?.country) {
            country.value = parsed.country
            national.value = parsed.formatNational()
        }
    },
    { immediate: true },
)
</script>

<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :hint="labelHint" :class="[disabled && 'text-muted-foreground', errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
            <slot name="labelHint"></slot>
        </Label>
        <InputControl :aria-invalid="!!errorMessage" :aria-describedby="errorMessage ? errorId : undefined" class="flex items-stretch">
            <Popover v-model:open="popoverOpen">
                <PopoverTrigger as-child>
                    <button
                        type="button"
                        :disabled="disabled"
                        class="flex items-center gap-1.5 pl-3 pr-2 text-sm hover:bg-foreground/4 rounded-l-[inherit] outline-none focus-visible:bg-foreground/4 transition-colors disabled:opacity-64 disabled:cursor-not-allowed"
                        :aria-label="__('form.phone_input.country_label')"
                    >
                        <span :class="flagClass(country)" class="rounded-xs shadow-xs/10"></span>
                        <span class="font-medium tabular-nums">{{ dialCode }}</span>
                        <Icon name="icon-chevron-down" class="size-3 text-muted-foreground" />
                    </button>
                </PopoverTrigger>
                <PopoverContent class="p-0 w-72" align="start">
                    <Command>
                        <CommandInput :placeholder="__('form.phone_input.country_search_placeholder')" />
                        <CommandList class="max-h-72 overflow-auto">
                            <CommandEmpty>{{ __('form.phone_input.no_country_found') }}</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    v-for="c in countries"
                                    :key="c.iso"
                                    :value="`${c.name} ${c.localizedName} ${c.iso} ${c.dial}`"
                                    @select="selectCountry(c.iso as CountryCode)"
                                    class="flex items-center gap-2"
                                >
                                    <span :class="flagClass(c.iso)" class="rounded-xs shadow-xs/10 shrink-0"></span>
                                    <span class="flex-1 truncate">
                                        {{ c.name }}<span v-if="c.localizedName && c.localizedName !== c.name" class="text-muted-foreground"> ({{ c.localizedName }})</span>
                                    </span>
                                    <span class="text-muted-foreground tabular-nums text-xs shrink-0">{{ c.dial }}</span>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <span class="w-px self-stretch bg-border my-1.5"></span>
            <Input
                :id="inputId"
                :name="name"
                type="tel"
                inputmode="tel"
                :placeholder="placeholder"
                :disabled="disabled"
                :modelValue="national"
                unstyled
                @update:modelValue="onNationalInput"
                @blur="handleBlur"
                v-bind="$attrs"
                input-class="pl-2"
            />
        </InputControl>
        <AnimatePresence multiple as="div" mode="wait">
            <motion.p v-if="hint && !errorMessage" :variants="variants" initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="formHintVariants({ variant: 'hint' })">
                {{ hint }}
            </motion.p>
            <motion.p v-if="errorMessage" :id="errorId" role="alert" :variants="variants" initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="formHintVariants({ variant: 'error' })">
                {{ errorMessage }}
            </motion.p>
        </AnimatePresence>
    </div>
</template>
