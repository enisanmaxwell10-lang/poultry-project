const features = [
  {
    title: 'Farm Fresh',
    desc: 'Sourced directly from our farm',
    icon: (
      <svg className="w-5 h-5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Quality Assured',
    desc: 'Healthy, carefully managed poultry',
    icon: (
      <svg className="w-5 h-5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Flexible Payment',
    desc: 'Delivery, transfer or card',
    icon: (
      <svg className="w-5 h-5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Reliable Delivery',
    desc: 'Safe delivery to your location',
    icon: (
      <svg className="w-5 h-5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    ),
  },
]

function FeaturesBar() {
  return (
    <div className="bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-[46px] h-[46px] bg-[#eaf2ea] rounded-xl flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold text-[14px] text-[#1A1A1A] leading-tight">{item.title}</h4>
                <p className="text-[12px] text-[#777] mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturesBar
