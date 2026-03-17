import { motion } from "framer-motion";
import { 
    Users, 
    GraduationCap, 
    UserCheck, 
    BarChart3 
} from "lucide-react";

const EducationFeature = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="flex items-start gap-4"
    >
        <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
            <Icon className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            <p className="text-[12px] leading-relaxed text-slate-500 max-w-[180px]">
                {description}
            </p>
        </div>
    </motion.div>
);

const MarketingPanel = () => {
    const features = [
        {
            icon: Users,
            title: "Student Records",
            description: "Easily see all student info and enrollment history.",
            delay: 1.0
        },
        {
            icon: GraduationCap,
            title: "Grades & Results",
            description: "Keep track of student grades and print report cards.",
            delay: 1.2
        },
        {
            icon: UserCheck,
            title: "Parent Updates",
            description: "Let parents see how their children are doing in school.",
            delay: 1.4
        },
        {
            icon: BarChart3,
            title: "School Management",
            description: "Manage your teachers, books, and school facilities.",
            delay: 1.6
        }
    ];

    return (
        <div className="hidden lg:flex h-full flex-col justify-center p-8 lg:p-10 bg-white relative overflow-hidden">
            <div className="relative z-10 space-y-6 max-w-lg mx-auto">
                <div className="space-y-3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <h2 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight text-slate-900">
                            Manage Your School <br />
                            <span className="text-indigo-600">The Simple Way.</span>
                        </h2>
                    </motion.div>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-sm leading-relaxed text-slate-500 font-medium max-w-xs"
                    >
                        We help you keep track of your students, teachers, and school activities in one simple place.
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-6 pt-1">
                    {features.map((feature, index) => (
                        <EducationFeature 
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            delay={feature.delay}
                        />
                    ))}
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
        </div>
    );
};

export default MarketingPanel;
