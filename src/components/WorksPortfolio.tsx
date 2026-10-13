import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Plus, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  X,
  CheckCircle2,
  Filter,
  UserCheck,
  Upload,
  Check
} from 'lucide-react';
import { serviceCategories } from '../data/mockData';

export const WorksPortfolio: React.FC = () => {
  const { 
    workPosts, 
    addWorkPost, 
    togglePostLike, 
    togglePostShare,
    addPostComment, 
    currentUser, 
    role, 
    setIsProfessionalCardOpen, 
    setSelectedArtisanForCard, 
    artisans,
    language 
  } = useApp();

  // Create post modal state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [trade, setTrade] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('الجزائر العاصمة');
  const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Active commenting post state
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  // Category filter
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  // Sample craft image presets for easy post creation
  const imagePresets = [
    { label: 'سباكة وترصيص', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80' },
    { label: 'كهرباء وإنارة', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80' },
    { label: 'نجارة وأثاث', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80' },
    { label: 'دهان وديكور', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80' },
    { label: 'ميكانيك سيارات', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80' },
    { label: 'بناء وسيراميك', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80' },
  ];

  const [shareToastMessage, setShareToastMessage] = useState<string | null>(null);

  const handleSharePost = (post: any) => {
    togglePostShare(post.id);
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `${post.title} — مشروع حرفي معتمد عبر تطبيق خـدّام`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      setShareToastMessage(`تم نسخ رابط عمل "${post.title}" بنجاح لمشاركته!`);
      setTimeout(() => setShareToastMessage(null), 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result;
        if (typeof res === 'string') {
          setCustomImageUrl(res);
          setSelectedImage(res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addWorkPost({
      title: title.trim(),
      trade: trade.trim() || (role === 'artisan' ? 'حرفي معتمد' : 'خدمات عامة'),
      description: description.trim(),
      image: customImageUrl.trim() || selectedImage,
      location: location.trim() || 'الجزائر العاصمة'
    });

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setIsCreatePostOpen(false);
      setTitle('');
      setDescription('');
    }, 1500);
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    addPostComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    // Ensure comments section is expanded
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const handleViewCard = (authorId: string) => {
    const foundArtisan = artisans.find(a => a.id === authorId);
    if (foundArtisan) {
      setSelectedArtisanForCard(foundArtisan);
    } else {
      setSelectedArtisanForCard(null);
    }
    setIsProfessionalCardOpen(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'معرض الأعمال وإتقان الصنعة' : 'Artisans Work Showcase'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black">
              {language === 'ar' ? 'أعمال الحرفيين ومشاريعهم المنجزة' : 'Real Artisan Projects & Portfolios'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              {language === 'ar'
                ? 'تصفح الأعمال الميدانية الموثقة، تفاعل بالقلوب والإعجاب، وشارك تعليقاتك واستفساراتك مع أمهر المهنيين.'
                : 'Browse verified fieldwork photos, show appreciation with hearts, and engage with craftsmen.'}
            </p>
          </div>

          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="h-11 px-5 bg-white text-slate-900 hover:bg-amber-50 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>{language === 'ar' ? 'نشر عمل جديد' : 'Post New Work'}</span>
          </button>
        </div>
      </div>

      {/* Share Toast Banner */}
      {shareToastMessage && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-between gap-2 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{shareToastMessage}</span>
          </div>
          <button onClick={() => setShareToastMessage(null)} className="p-1 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Feed of Posts */}
      <div className="space-y-6">
        {workPosts.map((post) => {
          const isCommentsOpen = expandedComments[post.id];
          const currentCommentText = commentInputs[post.id] || '';

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {/* Post Author Bar */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleViewCard(post.authorId)}
                    className="relative group focus:outline-none"
                    title="عرض البطاقة المهنية"
                  >
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 text-amber-400">
                      {post.authorLevel === 2 ? (
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      )}
                    </div>
                  </button>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {post.authorName}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        post.authorLevel === 2 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                      }`}>
                        {post.authorLevel === 2 ? 'مستوى 2 (دبلوم معتمد)' : 'مستوى 1 (هوية موثقة)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">{post.authorTrade}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{post.location}</span>
                      </span>
                      <span>·</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* View Professional Card CTA */}
                <button
                  onClick={() => handleViewCard(post.authorId)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'ar' ? 'البطاقة المهنية' : 'View Card'}</span>
                </button>
              </div>

              {/* Post Title & Description */}
              <div className="px-5 pt-4 pb-2 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {post.description}
                </p>
              </div>

              {/* Post Showcase Image */}
              <div className="mt-3 relative bg-slate-950 overflow-hidden max-h-[460px] flex items-center justify-center">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover max-h-[460px]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Engagement Bar: Heart / Like, Comments, Share */}
              <div className="p-4 sm:px-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  {/* Heart / Like Button */}
                  <button
                    onClick={() => togglePostLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-90 ${
                      post.hasLiked
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-300 dark:border-rose-800'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform ${post.hasLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                    <span className="tabular-nums font-sans">{post.likesCount}</span>
                    <span className="hidden sm:inline">{language === 'ar' ? 'إعجاب' : 'Like'}</span>
                  </button>

                  {/* Comment Toggle Button */}
                  <button
                    onClick={() => handleToggleComments(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    <span className="tabular-nums font-sans">{post.comments.length}</span>
                    <span className="hidden sm:inline">{language === 'ar' ? 'تعليقات' : 'Comments'}</span>
                  </button>

                  {/* Share Button (خاصية المشاركة) */}
                  <button
                    onClick={() => handleSharePost(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                    title="مشاركة العمل"
                  >
                    <Share2 className="w-4 h-4 text-blue-500" />
                    <span className="tabular-nums font-sans">{post.sharesCount || 0}</span>
                    <span className="hidden sm:inline">{language === 'ar' ? 'مشاركة' : 'Share'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleComments(post.id)}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"
                  >
                    <span>{isCommentsOpen ? 'إخفاء التعليقات' : 'عرض التعليقات'}</span>
                    {isCommentsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {isCommentsOpen && (
                <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
                  {/* List of comments */}
                  <div className="space-y-3">
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-2">
                        كن أول من يعلق على هذا الإنجاز الرائع!
                      </p>
                    ) : (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                {comment.authorName}
                              </span>
                              <span className="text-[10px] text-slate-400">{comment.date}</span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment input */}
                  <div className="flex items-center gap-2 pt-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-amber-400/50"
                      referrerPolicy="no-referrer"
                    />
                    <input
                      type="text"
                      placeholder="أضف تعليقاً محترماً أو استفساراً للحرفي..."
                      value={currentCommentText}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id);
                        }
                      }}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-xs"
                      title="إرسال التعليق"
                    >
                      <Send className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CREATE WORK POST MODAL */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative my-6">
            <button
              onClick={() => setIsCreatePostOpen(false)}
              className="absolute rtl:left-4 ltr:right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'نشر عمل أو مشروع جديد' : 'Publish New Work Portfolio'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'اعرض مهاراتك وإتقانك بالصور والوصف لبناء الثقة وجذب الزبائن' : 'Showcase your completed craftsmanship'}
              </p>
            </div>

            {publishSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  تم نشر العمل بنجاح في المعرض!
                </h4>
                <p className="text-xs text-slate-500">سيظهر مشروعك لجميع طالبي الخدمات والحرفيين في المنصة.</p>
              </div>
            ) : (
              <form onSubmit={handleCreatePost} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    عنوان العمل / المشروع *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تركيب شبكة سباكة متطورة لشقة دوبلكس"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      المهنة أو التخصص
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: سباكة وترصيص صحي"
                      value={trade}
                      onChange={(e) => setTrade(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      المدينة / الحي
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: حيدرة، الجزائر العاصمة"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    وصف العمل والتفاصيل الفنية *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="اشرح المواد المستخدمة، مدة الإنجاز، والضمان المقدم للزبون..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Image selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    صورة الإنجاز (يمكنك رفع صورة من هاتفك أو اختيار نموذج):
                  </label>

                  {/* Upload directly from Phone / Camera */}
                  <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/20 border-2 border-dashed border-amber-400 dark:border-amber-800 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          تحميل صورة من الهاتف / الكاميرا
                        </span>
                        <span className="text-[10px] text-slate-500">
                          يدعم جميع صيغ الصور مباشرة من جهازك
                        </span>
                      </div>
                    </div>

                    <label className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shrink-0 transition-transform active:scale-95 shadow-xs">
                      <span>اختيار صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {customImageUrl && (
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-amber-500">
                      <img
                        src={customImageUrl}
                        alt="معاينة الصورة المختارة"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold">
                        صورة محملة من هاتفك بنجاح ✓
                      </span>
                    </div>
                  )}

                  <span className="block text-[11px] text-slate-500 font-semibold pt-1">
                    أو اختر من النماذج الحرفية الجاهزة:
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    {imagePresets.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setSelectedImage(preset.url);
                          setCustomImageUrl('');
                        }}
                        className={`relative rounded-xl overflow-hidden border-2 text-start p-1 transition-all ${
                          selectedImage === preset.url && !customImageUrl
                            ? 'border-amber-500 ring-2 ring-amber-500/20'
                            : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-14 object-cover rounded-lg"
                        />
                        <span className="text-[10px] font-bold block mt-1 truncate">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="url"
                    placeholder="أو ضع رابط صورة خارجية (اختياري)..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'ar' ? 'نشر الإنجاز في المعرض العام' : 'Publish to Showcase'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
