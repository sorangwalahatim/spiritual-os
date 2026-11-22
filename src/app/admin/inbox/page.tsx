'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  MessageCircle, 
  Mail, 
  Sparkles, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  User, 
  Clock, 
  ThumbsUp, 
  AlertCircle 
} from 'lucide-react';
import { getAppState, approveAiReply, sendManualMessage } from '@/lib/services/store';
import { formatDateTime } from '@/lib/utils/date';
import { Conversation } from '@/lib/types/domain';

export default function UnifiedInboxPage() {
  const state = getAppState();
  const [selectedConv, setSelectedConv] = useState<Conversation>(state.conversations[0]);
  const [replyText, setReplyText] = useState('');

  const handleApprove = async (msgId: string) => {
    const draftMsg = selectedConv.messages.find(m => m.id === msgId);
    approveAiReply(selectedConv.id, msgId);
    const updated = getAppState().conversations.find(c => c.id === selectedConv.id);
    if (updated) setSelectedConv(updated);

    // Call server message delivery API
    if (draftMsg) {
      try {
        await fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: selectedConv.id,
            recipientPhone: selectedConv.contactPhone,
            message: draftMsg.body,
          }),
        });
      } catch (err) {
        console.warn('Message API call completed:', err);
      }
    }
  };

  const handleSendManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const textToSend = replyText;
    setReplyText('');
    sendManualMessage(selectedConv.id, textToSend);
    const updated = getAppState().conversations.find(c => c.id === selectedConv.id);
    if (updated) setSelectedConv(updated);

    // Call server message delivery API
    try {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          recipientPhone: selectedConv.contactPhone,
          message: textToSend,
        }),
      });
    } catch (err) {
      console.warn('Message API call completed:', err);
    }
  };

  const openDirectWhatsApp = () => {
    const cleanPhone = selectedConv.contactPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(replyText || 'Namaste from AstroVeda Sanctuary.')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <MessageSquare className="w-4 h-4" />
            <span>Communications & AI Reply Hub</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Unified Client Inbox
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Omnichannel messaging across WhatsApp Business and Email with human-in-the-loop AI reply copilot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Business Connected</span>
          </span>
        </div>
      </div>

      {/* Main Inbox Workspace (Split Queue & Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[700px]">
        {/* Left Conversation List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs h-full flex flex-col">
          <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Conversations</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {state.conversations.length} Active
            </span>
          </div>

          <div className="divide-y divide-stone-100 overflow-y-auto flex-1">
            {state.conversations.map((conv) => {
              const isSelected = selectedConv.id === conv.id;
              const hasDraft = conv.messages.some(m => m.isAiGeneratedDraft && !m.isApprovedByHuman);

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`p-4 text-xs cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/60 border-l-4 border-l-amber-600' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      {conv.channel === 'WHATSAPP' ? (
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      <span>{conv.contactName}</span>
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {formatDateTime(conv.lastActivityAt, state.tenant.timezone)}
                    </span>
                  </div>

                  <p className="text-stone-600 line-clamp-2 text-[11px] leading-relaxed">
                    {conv.lastMessageSnippet}
                  </p>

                  {hasDraft && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-semibold border border-amber-300/60">
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>AI Draft Needs Approval</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Pane (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 shadow-xs h-full flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                {selectedConv.contactName[0]}
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">{selectedConv.contactName}</h3>
                <p className="text-[11px] text-stone-500">{selectedConv.contactPhone} • Channel: {selectedConv.channel}</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {selectedConv.status}
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50/30">
            {selectedConv.messages.map((msg) => {
              const isInbound = msg.direction === 'INBOUND';
              const isDraft = msg.isAiGeneratedDraft && !msg.isApprovedByHuman;

              if (isDraft) {
                return (
                  <div key={msg.id} className="p-4 rounded-xl border border-amber-300 bg-amber-50/90 shadow-xs space-y-2.5 max-w-xl mx-auto">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 border-b border-amber-200/80 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        AI Copilot Draft (Pending Human Approval)
                      </span>
                      <span className="text-[10px] text-amber-700 font-mono">ASSISTIVE DRAFT</span>
                    </div>
                    <p className="text-xs text-stone-800 leading-relaxed font-sans">
                      {msg.body}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-stone-500 italic">
                        * In accordance with Section 13 ethics, AI will not send without your click.
                      </span>
                      <button
                        onClick={() => handleApprove(msg.id)}
                        className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Approve & Send to WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isInbound
                        ? 'bg-white border border-stone-200 text-stone-900 rounded-bl-none shadow-2xs'
                        : 'bg-stone-900 text-white rounded-br-none shadow-2xs'
                    }`}
                  >
                    <p>{msg.body}</p>
                    <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${isInbound ? 'text-stone-400' : 'text-stone-400'}`}>
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{formatDateTime(msg.createdAt, state.tenant.timezone)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Composer */}
          <form onSubmit={handleSendManual} className="p-3 border-t border-stone-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type message or reply via WhatsApp..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={openDirectWhatsApp}
              title="Open directly in WhatsApp Web/App"
              className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
