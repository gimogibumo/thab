
import exchangeRates from '@/../public/exchangeRates.json'

const parseRate = (rateStr) => {
  if (typeof rateStr === 'string') {
    return Number(rateStr.replace(/,/g, ''))
  }
  return Number(rateStr)
}

// 100단위 기준 통화 목록
const perHundredCurrencies = ['JPY(100)', 'IDR(100)']


/**
 * 환율 변환 함수
 * @param {number} amount 변환할 금액
 * @param {string} from 통화 단위 (예: 'KRW', 'USD', 'JPY(100)')
 * @param {string} to 변환 대상 통화 단위 (예: 'USD', 'KRW')
 * @returns {number|null} 변환된 금액 (소수점 둘째 자리까지), 실패 시 null
 */
export function convertCurrency(amount, from, to) {
  if (from === to) return amount

  const getRate = (unit) => {
    const data = exchangeRates.find((item) => item.cur_unit === unit)
    if (!data) return null

    const rate = parseRate(data.deal_bas_r)
    return perHundredCurrencies.includes(unit) ? rate / 100 : rate
  }

  if (from === 'KRW') {
    // 원화 → 외화
    const toRate = getRate(to)
    return toRate ? Number((amount / toRate).toFixed(2)) : null
  } else if (to === 'KRW') {
    // 외화 → 원화
    const fromRate = getRate(from)
    return fromRate ? Number((amount * fromRate).toFixed(2)) : null
  } else {
    // 외화 → 외화
    const fromRate = getRate(from)
    const toRate = getRate(to)
    if (!fromRate || !toRate) return null

    const krwAmount = amount * fromRate
    return Number((krwAmount / toRate).toFixed(2))
  }
}
