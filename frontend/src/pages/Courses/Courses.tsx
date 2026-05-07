import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useI18n } from '../../i18n';

interface Module {
  id: string;
  title: string;
  content: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  progress?: number;
  thumbnail?: string;
}

const CoursesPage: React.FC = () => {
  const { t } = useI18n();
  // 模拟课程数据
  const courses: Course[] = [
    {
      id: '1',
      title: t('mathBasics'),
      description: 'Algebra, geometry, and introductory calculus.',
      progress: 65,
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mathematics%20education%20concept%20with%20formulas%20and%20geometry&image_size=landscape_16_9',
      modules: [
        { id: '1-1', title: 'Algebra basics', content: 'Variables, equations, and inequalities.' },
        { id: '1-2', title: 'Geometry intro', content: 'Plane and solid geometry foundations.' },
        { id: '1-3', title: 'Calculus preview', content: 'Core ideas behind derivatives and integrals.' },
      ],
    },
    {
      id: '2',
      title: t('physicsIntro'),
      description: 'Mechanics, thermodynamics, and electromagnetism foundations.',
      progress: 30,
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=physics%20education%20concept%20with%20science%20equipment&image_size=landscape_16_9',
      modules: [
        { id: '2-1', title: "Newton's laws", content: 'The three laws of motion and applications.' },
        { id: '2-2', title: 'Energy conservation', content: 'Kinetic energy, potential energy, and conservation.' },
        { id: '2-3', title: 'Electromagnetism basics', content: 'Electric fields, magnetic fields, and induction.' },
      ],
    },
    {
      id: '3',
      title: t('programmingBasics'),
      description: 'Introductory Python, JavaScript, and programming concepts.',
      progress: 80,
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=programming%20education%20concept%20with%20code%20and%20laptop&image_size=landscape_16_9',
      modules: [
        { id: '3-1', title: 'Python basics', content: 'Variables, data types, and control flow.' },
        { id: '3-2', title: 'JavaScript intro', content: 'Frontend development foundations.' },
        { id: '3-3', title: 'Algorithms basics', content: 'Common algorithms and data structures.' },
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(selectedCourse?.id === course.id ? null : course);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('myCourses')}</h1>
        <p className="text-gray-600">{t('manageCourses')}</p>
      </div>
      
      {/* 搜索和添加按钮 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder={t('searchCourses')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <Button variant="primary" size="md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('addCourse')}
        </Button>
      </div>
      
      {/* 课程列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} shadow="lg" hover={true} className="overflow-hidden transition-all duration-300">
            <div className="cursor-pointer" onClick={() => handleCourseClick(course)}>
              {/* 课程封面 */}
              {course.thumbnail && (
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-800 shadow-sm">
                    {course.progress}% Complete
                  </div>
                </div>
              )}
              
              {/* 课程信息 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                  <button className="text-gray-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-50">
                    {selectedCourse?.id === course.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                {/* 进度条 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                    <span>{t('progress')}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{course.modules.length} {t('modules')}</span>
                  <Button variant="primary" size="sm">
                    {t('continueLearning')}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* 课程模块详情 */}
            {selectedCourse?.id === course.id && (
              <div className="px-6 pb-6 pt-4 border-t border-gray-200 animate-slide-in">
                <h4 className="font-semibold text-gray-800 mb-4">{t('courseModules')}</h4>
                <div className="space-y-3">
                  {course.modules.map((module, index) => (
                    <div key={module.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{module.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{module.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
