import type { NextPage } from 'next'
import SKU from 'components/sku'

const Home: NextPage = () => {
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

export default Home
