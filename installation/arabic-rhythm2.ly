\version "2.18.2"

doom =
{
	\override Stem.direction = #DOWN
	d''2
}
doom_strong =
{
	\override Stem.direction = #DOWN
	d''2-^
}
doom_semi =
{
	\override Stem.direction = #DOWN
	d''2->
}


dom =
{
	\override Stem.direction = #DOWN
	d''4
}
dom_dot =
{
	\override Stem.direction = #DOWN
	d''4.
}
dom_dot_strong =
{
	\override Stem.direction = #DOWN
	d''4.-^
}
dom_semi =
{
	\override Stem.direction = #DOWN
	d''4->
}
dom_strong =
{
	\override Stem.direction = #DOWN
	d''4-^
}



do =
{
	\override Stem.direction = #DOWN
	d''8
}
do_noBeam =
{
	\override Stem.direction = #DOWN
	d''8\noBeam
}
do_semi =
{
	\override Stem.direction = #DOWN
	d''8->
}
do_strong =
{
	\override Stem.direction = #DOWN
	d''8-^
}
do_strong_noBeam =
{
	\override Stem.direction = #DOWN
	d''8\noBeam-^
}
do_dot =
{
	\override Stem.direction = #DOWN
	d''8.
}




du =
{
	\override Stem.direction = #DOWN
	d''16
}
du_noBeam =
{
	\override Stem.direction = #DOWN
	d''16\noBeam
}




taaak_strong =
{
	\override Stem.direction = #UP
	d''1-^
}




taak =
{
	\override Stem.direction = #UP
	d''2
}
taak_semi =
{
	\override Stem.direction = #UP
	d''2->
}



tak =
{
	\override Stem.direction = #UP
	d''4
}
tak_strong =
{
	\override Stem.direction = #UP
	d''4-^
}
tak_semi =
{
	\override Stem.direction = #UP
	d''4->
}



ta =
{
	\override Stem.direction = #UP
	d''8
}
ta_dot =
{
	\override Stem.direction = #UP
	d''8.
}
ta_semi =
{
	\override Stem.direction = #UP
	d''8->
}




ti =
{
	\override Stem.direction = #UP
	d''16
}





taaakl =
{
	\override Stem.direction = #UP
	g'1
}
taaakl_strong =
{
	\override Stem.direction = #UP
	g'1-^
}



taakl =
{
	\override Stem.direction = #UP
	g'2
}
taakl_strong =
{
	\override Stem.direction = #UP
	g'2-^
}
taakl_semi =
{
	\override Stem.direction = #UP
	g'2->
}



takl =
{
	\override Stem.direction = #UP
	g'4
}
takl_dot =
{
	\override Stem.direction = #UP
	g'4.
}
takl_dot_semi =
{
	\override Stem.direction = #UP
	g'4.->
}
takl_semi =
{
	\override Stem.direction = #UP
	g'4->
}
takl_strong =
{
	\override Stem.direction = #UP
	g'4-^
}




tal =
{
	\override Stem.direction = #UP
	g'8
}
tal_semi =
{
	\override Stem.direction = #UP
	g'8->
}




til =
{
	\override Stem.direction = #UP
	g'16
}
til_noBeam =
{
	\override Stem.direction = #UP
	g'16\noBeam
}











haakl_semi =
{
	\override Stem.direction = #UP
	\override NoteHead.style = #'xcircle
	g'2->
	\revert NoteHead.style
}




sep =
{
	\bar "!"
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

	\override Staff.StaffSymbol.line-count = #2
	\override Staff.StaffSymbol.line-positions = #'(-2 2)
