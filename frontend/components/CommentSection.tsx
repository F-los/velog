'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Reply, Heart, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Comment } from '@/types/blog';

interface CommentSectionProps {
  postSlug: string;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    postSlug: 'next-js-app-router-guide',
    author: '개발자A',
    content: '정말 유용한 정보네요! App Router를 막 시작하려던 참이었는데 많은 도움이 됐습니다. 특히 레이아웃 컴포넌트 부분이 이해하기 쉽게 설명되어 있어서 좋았어요.',
    date: '2024-01-16T09:30:00Z',
    replies: [
      {
        id: '2',
        postSlug: 'next-js-app-router-guide',
        author: '김태회',
        content: '도움이 되셨다니 정말 기쁩니다! 더 궁금한 점이 있으시면 언제든지 댓글로 남겨주세요.',
        date: '2024-01-16T10:15:00Z',
      }
    ]
  },
  {
    id: '3',
    postSlug: 'next-js-app-router-guide',
    author: 'React개발자',
    content: 'Server Components와 Client Components의 차이점에 대해서도 더 자세한 포스트를 작성해주시면 좋을 것 같아요!',
    date: '2024-01-16T14:20:00Z',
  },
  {
    id: '4',
    postSlug: 'next-js-app-router-guide',
    author: '프론트엔드신입',
    content: 'Pages Router에서 App Router로 마이그레이션 과정도 궁금합니다. 실제 프로젝트에서 어떤 점들을 주의해야 할까요?',
    date: '2024-01-17T08:45:00Z',
  }
];

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postSlug,
      author: userName,
      content: newComment,
      date: new Date().toISOString(),
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setUserName('');
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim() || !userName.trim()) return;

    const reply: Comment = {
      id: Date.now().toString(),
      postSlug,
      author: userName,
      content: replyContent,
      date: new Date().toISOString(),
    };

    setComments(comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));

    setReplyContent('');
    setReplyTo(null);
    setUserName('');
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg p-6 ${isReply ? 'ml-8 border-l-2 border-purple-200' : 'shadow-sm border border-gray-100'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-sm">
              {comment.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{comment.author}</h4>
            <p className="text-sm text-gray-500">
              {format(new Date(comment.date), 'yyyy년 M월 d일 HH:mm', { locale: ko })}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <p className="text-gray-700 leading-relaxed mb-4">
        {comment.content}
      </p>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
          <Heart size={16} />
          <span className="text-sm">좋아요</span>
        </button>
        {!isReply && (
          <button
            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <Reply size={16} />
            <span className="text-sm">답글</span>
          </button>
        )}
      </div>

      {/* Reply Form */}
      {replyTo === comment.id && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={(e) => handleSubmitReply(e, comment.id)}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="이름"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <textarea
              placeholder="답글을 작성해주세요..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                답글 작성
              </button>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-6 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="text-purple-600" size={24} />
        <h3 className="text-2xl font-bold text-gray-900">
          댓글 {comments.length}개
        </h3>
      </div>

      {/* Comment Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmitComment}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-8"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="이름"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <textarea
            placeholder="댓글을 작성해주세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              댓글 작성
            </button>
          </div>
        </div>
      </motion.form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">아직 댓글이 없습니다.</p>
            <p className="text-gray-400">첫 번째 댓글을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}