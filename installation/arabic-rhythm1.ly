\version "2.18.2"

dom =
{
	\override Stem.direction = #DOWN
	b'4
}
dom_dot =
{
	\override Stem.direction = #DOWN
	b'4.
}
dom_strong =
{
	\override Stem.direction = #DOWN
	b'4-^
}
dom_semi =
{
	\override Stem.direction = #DOWN
	b'4->
}
do =
{
	\override Stem.direction = #DOWN
	b'8
}
do_dot =
{
	\override Stem.direction = #DOWN
	b'8.
}
do_noBeam =
{
	\override Stem.direction = #DOWN
	b'8\noBeam
}
do_dot_noBeam =
{
	\override Stem.direction = #DOWN
	b'8.\noBeam
}

du =
{
	\override Stem.direction = #DOWN
	b'16
}


tak =
{
	\override Stem.direction = #UP
	b'4
}
tak_dot =
{
	\override Stem.direction = #UP
	b'4.
}

ta =
{
	\override Stem.direction = #UP
	b'8
}
ta_dot =
{
	\override Stem.direction = #UP
	b'8.
}
ta_noBeam =
{
	\override Stem.direction = #UP
	b'8\noBeam
}
ta_semi =
{
	\override Stem.direction = #UP
	b'8->
}

ti =
{
	\override Stem.direction = #UP
	b'16
}


sak =
{
	\override Stem.direction = #UP
	\override NoteHead.style = #'cross
	b'4
	\revert NoteHead.style
}
sa =
{
	\override Stem.direction = #UP
	\override NoteHead.style = #'cross
	b'8
	\revert NoteHead.style
}

sep =
{
	\bar "!"
}




hak =
{
	\override Stem.direction = #UP
	\override NoteHead.style = #'xcircle
	b'4
	\revert NoteHead.style
}





\header {
	tagline = ##f
}
\paper {
	raggedright = ##t
	raggedbottom = ##t
	indent = 0\mm
}

\score{
	\layout
	{
	    #(layout-set-staff-size 26)
	}
	\new Staff{

	\pointAndClickOff
	\override Staff.Clef.stencil = ##f
	\numericTimeSignature

	\override Staff.StaffSymbol.line-count = #1
