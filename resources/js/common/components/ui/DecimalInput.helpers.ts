/**
 * Sanitizes a string to only allow valid decimal input.
 * Accepts both comma and dot as decimal separators (Brazilian standard uses comma).
 * Strips letters and ensures only one decimal separator.
 */
export const sanitizeDecimal = (value: string, maxDecimals = 8): string => {
    let result = value.replace(/[^\d,]/g, '')
    let foundComma = false
    result = Array.from(result)
        .filter((char) => {
            if (char === ',') {
                if (foundComma) return false
                foundComma = true
            }
            return true
        })
        .join('')
    const commaIdx = result.indexOf(',')
    if (commaIdx !== -1 && result.length - commaIdx - 1 > maxDecimals) {
        result = result.slice(0, commaIdx + 1 + maxDecimals)
    }
    return result
}
