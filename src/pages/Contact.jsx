import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Send, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill out all fields', variant: 'destructive' });
      return;
    }
    setSending(true);
    // Simulate send
    await new Promise(r => setTimeout(r, 1000));
    toast({ title: 'Message sent!', description: 'We\'ll get back to you soon.' });
    setForm({ name: '', email: '', message: '' });
    setSending(false);
  };

  return (
    <div className="pt-14">
      {/* Header */}
      <section className="px-[5vw] md:px-[10vw] pb-16 md:pb-24 topo-pattern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Contact
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight">
            Get in Touch
          </h1>
          <p className="font-body text-lg text-muted-foreground mt-4 max-w-xl leading-relaxed">
            Interested in joining Troop 1099 or have a question? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <section className="px-[5vw] md:px-[10vw] pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-heading text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                    Your Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    className="bg-background border-border font-body text-base h-12 rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-heading text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-background border-border font-body text-base h-12 rounded-sm"
                  />
                </div>
              </div>
              <div>
                <label className="font-heading text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                  Message
                </label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your interest in Troop 1099..."
                  rows={6}
                  className="bg-background border-border font-body text-base rounded-sm resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-heading font-semibold text-sm tracking-wider uppercase h-12 px-8 rounded-sm"
              >
                {sending ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-8">
              <div>
                <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-6">
                  Contact Info
                </p>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm text-foreground">Meeting Location</p>
                      <p className="font-body text-sm text-muted-foreground mt-0.5">
                        Community Center, Room 204
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm text-foreground">Meeting Time</p>
                      <p className="font-body text-sm text-muted-foreground mt-0.5">
                        Every Monday, 7:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm text-foreground">Email</p>
                      <p className="font-body text-sm text-muted-foreground mt-0.5">
                        troop1099@bsa.org
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm text-foreground">Phone</p>
                      <p className="font-body text-sm text-muted-foreground mt-0.5">
                        (555) 109-9000
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-sm p-6">
                <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-3">
                  Visit a Meeting
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  The best way to learn about Troop 1099 is to attend a Monday meeting.
                  Prospective scouts and families are always welcome — no RSVP needed.
                </p>
                <div className="flex items-center gap-2 mt-4 text-accent font-heading text-sm font-semibold">
                  <span>Just show up</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}