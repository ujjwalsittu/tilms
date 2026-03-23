<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        $tickets = SupportTicket::where('user_id', auth()->id())
            ->latest()
            ->paginate(20);

        return Inertia::render('Student/Support/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function create()
    {
        return Inertia::render('Student/Support/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string|max:10000',
            'priority' => 'in:low,medium,high',
        ]);

        $ticket = SupportTicket::create([
            'user_id' => auth()->id(),
            'subject' => $validated['subject'],
            'priority' => $validated['priority'] ?? 'medium',
        ]);

        SupportTicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'body' => $validated['body'],
            'created_at' => now(),
        ]);

        return redirect()->route('student.support.show', $ticket->id)->with('success', 'Ticket created.');
    }

    public function show(SupportTicket $ticket)
    {
        abort_if($ticket->user_id !== auth()->id(), 403);

        $messages = SupportTicketMessage::where('ticket_id', $ticket->id)
            ->with('user:id,name,role')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Student/Support/Show', [
            'ticket' => $ticket,
            'messages' => $messages,
        ]);
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        abort_if($ticket->user_id !== auth()->id(), 403);
        abort_if(in_array($ticket->status->value, ['closed']), 403, 'This ticket is closed.');

        $validated = $request->validate(['body' => 'required|string|max:10000']);

        SupportTicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'body' => $validated['body'],
            'created_at' => now(),
        ]);

        return back()->with('success', 'Reply sent.');
    }
}
