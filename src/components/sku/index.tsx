/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { getPrime, PathFinder, descartes } from '@/utils'

interface ValueInLabels {
  [elem: string]: number
}

interface CanUseSku {
  skuName: string[]
  skuPrime: number[]
  stock: number
}

const SKU = (props: { type: string[][] }) => {
  // 规格
  const { type } = props
  // 已经选中的规格
  const [selected, setSelected] = useState<string[]>([])
  // 可选规格
  const [unDisabled, setUnDisabled] = useState<number[]>([])
  // 可用 sku
  const [canUseSku, setCanUseSku] = useState<CanUseSku[]>([])
  // 质数，规格枚举值
  const [valueInLabel, setValueInLabel] = useState<ValueInLabels>({})
  // 预留 sku 工具包
  const [pathFinder, setPathFinder] = useState<any>(null)

  useEffect(() => {
    // 抹平规格内容
    const types = type.flat()
    // 通过抹平规格，获取规格对应质数
    const prime = getPrime(types.length)
    // 质数对应规格数 枚举值处理
    const _valueInLabel: ValueInLabels = {}
    types.forEach((item: string, index: number) => {
      _valueInLabel[item] = prime[index]
    })
    setValueInLabel(_valueInLabel)

    // 根据规格坐标，排序质数坐标
    const way = type.map((i) => i.map(ii => _valueInLabel[ii]))
    // 使用笛卡尔积计算下sku
    const sku: CanUseSku[] = descartes(type).map((item) => {
      return {
        // 随机库存内容
        stock: Math.floor(Math.random() * 10) > 5 ? 0 : 1,
        // 规格名
        skuName: item,
        // 规格对应质数
        skuPrime: item.map(ii => _valueInLabel[ii])
      }
    })
    // 筛选可选的 SKU
    const _canUseSku = sku.filter((item) => item.stock)
    setCanUseSku(_canUseSku)
    // 初始化规格展示内容
    const _pathFinder = new PathFinder(
      way,
      _canUseSku.map((item: { skuPrime: any }) => item.skuPrime)
    )
    setPathFinder(_pathFinder)
    // 获取不可选规格内容
    const _unDisabled = _pathFinder.getWay().flat()

    setUnDisabled(_unDisabled)
  }, [type])

  /**
   * 点击选择规格
   * @param {String} cType
   * @param {Number} prime
   * @param {Number} primeIndex
   */
  const onClickSelType = (cType: string, prime: number, primeIndex: number) => {
    // 检查此次选择是否在已选内容中
    const index = selected.indexOf(cType)
    // 获取已经有的矩阵值
    const { light } = pathFinder
    // 如果未选中则提供选中，如果选中移除
    if (index > -1) {
      pathFinder.remove(prime)
      selected.splice(index, 1)
    } else if (light[primeIndex].includes(2)) {
      // 如果同规格中，有选中，则先移除选中，
      // 获取需要移除的同行规格
      const removeType = type[primeIndex][light[primeIndex].indexOf(2)]
      // 获取需要提出的同行规格质数
      const removePrime = valueInLabel[removeType]
      // 移除
      pathFinder.remove(removePrime)
      selected.splice(selected.indexOf(removeType), 1)
      //移除同行后，添加当前选择规格
      pathFinder.add(prime)
      selected.push(cType)
    } else {
      pathFinder.add(prime)
      selected.push(cType)
    }
    setSelected(selected)

    // 更新不可选规格
    const _unDisabled = pathFinder.getWay().flat()
    setUnDisabled(_unDisabled)
  }

  return (
    <div className='relative max-w-5xl mx-auto pt-20 sm:pt-24 lg:pt-32'>
      <h3 className='text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center'>React SKU Display Template.</h3>
      <div>
        <p className='mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400'>Specification:</p>
        {type.map((item: any[], index: number) => (
          <div style={{ margin: 10 }} key={index}>
            {item.map((btn, bIndex) => (
              <Button
                style={{ margin: '0 10px' }}
                type={selected.includes(btn) ? 'primary' : undefined}
                disabled={!unDisabled.includes(valueInLabel[btn])}
                onClick={() => onClickSelType(btn, valueInLabel[btn], index)}
                key={bIndex}
              >
                {btn}
              </Button>
            ))}
          </div>
        ))}
        Selectable SKU:
        {canUseSku.map((item: any, index: number) => (
          <Button style={{ margin: '0 10px' }} key={index}>
            {item.skuName}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SKU
