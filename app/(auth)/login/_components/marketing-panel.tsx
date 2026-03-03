import { motion } from "framer-motion";
import NovaLogo from "@/components/ui/nova-logo";

const MarketingPanel = () => {
    return (
        <div className="hidden lg:flex h-full flex-col justify-between p-12 bg-white/5 backdrop-blur-md relative overflow-hidden border-r border-white/10">
            {/* Animated background highlights */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1] 
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/20 rounded-full blur-[120px]" 
                />
            </div>

            <div className="relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex justify-start mb-16"
                >
                    <div className="p-4 bg-white/10 backdrop-blur-2xl rounded-[24px] border border-white/20 shadow-xl">
                        <NovaLogo size="lg" className="items-start" />
                    </div>
                </motion.div>
                
                <div className="space-y-8 max-w-xl">
                    <motion.h2 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tighter text-white"
                    >
                        Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">Institutional</span> Intelligence.
                    </motion.h2>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="space-y-4"
                    >
                        <p className="text-xl leading-relaxed text-white/70 font-bold tracking-tight">
                            The elite management ecosystem for modern African schools. Precision tools for enrollments, finances, and academic excellence.
                        </p>
                        
                        <div className="flex items-center gap-4 py-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-80" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] font-black text-white/50 uppercase tracking-widest">
                                Trusted by 200+ Institutions
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="relative z-10"
            >
                <div className="p-8 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-3xl">
                    <p className="text-sm font-bold text-white/80 italic leading-relaxed">
                        "The transition to LSA has been revolutionary for our administrative efficiency. It's not just a tool; it's our central nervous system."
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-black">AD</div>
                        <div>
                            <p className="text-xs font-black text-white">Austin D.</p>
                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Director, LSA International</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MarketingPanel;
