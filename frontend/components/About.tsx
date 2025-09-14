'use client'

import { motion } from 'framer-motion'
import { Code2, Server, Cloud, Zap } from 'lucide-react'

const About = () => {
  const highlights = [
    {
      icon: <Server className="w-8 h-8" />,
      title: "백엔드 전문성",
      description: "Java Spring Boot를 주력으로 하는 백엔드 시스템 개발"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "클라우드 아키텍처",
      description: "AWS 기반 마이크로서비스 아키텍처 설계 및 구현"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "성능 최적화",
      description: "대용량 트래픽 처리와 시스템 성능 개선 전문"
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "새로운 기술",
      description: "최신 기술 학습과 실무 적용을 즐기는 개발자"
    }
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-purple-gradient bg-clip-text text-transparent">About Me</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            확장 가능하고 안정적인 백엔드 시스템을 만드는 것을 좋아하는 개발자입니다.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              안녕하세요! 👋
            </h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                저는 <strong className="text-purple-700">Java Spring Boot</strong>를 주력으로 하여 
                클라우드 환경에서의 <strong className="text-purple-700">마이크로서비스 아키텍처</strong> 
                설계와 구현에 관심이 많은 백엔드 개발자입니다.
              </p>
              <p>
                새로운 기술을 학습하고 실무에 적용하는 것을 즐기며, 
                <strong className="text-purple-700">확장 가능하고 안정적인 시스템</strong>을 
                만들기 위해 끊임없이 노력하고 있습니다.
              </p>
              <p>
                현재는 <strong className="text-purple-700">대용량 트래픽 처리</strong>와 
                <strong className="text-purple-700">성능 최적화</strong>에 특히 관심을 가지고 
                다양한 프로젝트를 진행하고 있습니다.
              </p>
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">3+</div>
                <div className="text-sm text-gray-600">년 경력</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">15+</div>
                <div className="text-sm text-gray-600">완료 프로젝트</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="flex items-start space-x-4 p-6 bg-white border border-purple-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0 p-3 bg-purple-gradient rounded-lg text-white">
                  {highlight.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{highlight.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-purple-gradient-light rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-4 text-purple-800">개발 철학</h3>
            <blockquote className="text-lg text-purple-700 italic max-w-3xl mx-auto">
              "코드는 사람이 읽기 위한 것이며, 기계는 그것을 실행할 뿐이다"
            </blockquote>
            <p className="mt-4 text-purple-600 max-w-2xl mx-auto">
              가독성 있는 코드, 테스트 주도 개발, 지속적인 학습을 통해 
              더 나은 소프트웨어를 만들어가고 있습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About