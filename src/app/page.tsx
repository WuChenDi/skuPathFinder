import SKU from '@/components/sku'

export default function Home() {
  const skuType = [
    ['男裤', '女裤'],
    ['黑色', '白色'],
    ['S', 'L'],
  ]
  return (
    <div style={{ textAlign: 'center' }}>
      <SKU type={skuType} />
    </div>
  )
}
