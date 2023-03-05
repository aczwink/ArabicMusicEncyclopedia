\version "2.18.2"

%%%%%%%%%%%%%%%%%%
%%%%%% Doms %%%%%%
%%%%%%%%%%%%%%%%%%

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
dom_noBeam =
{
	\override Stem.direction = #DOWN
	b'4\noBeam
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
du_noBeam =
{
	\override Stem.direction = #DOWN
	b'16\noBeam
}

duf =
{
	\override Stem.direction = #DOWN
	b'32
}
duf_noBeam =
{
	\override Stem.direction = #DOWN
	b'32\noBeam
}


%%%%%%%%%%%%%%%%%%
%%%%%% Taks %%%%%%
%%%%%%%%%%%%%%%%%%


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

tif =
{
	\override Stem.direction = #UP
	b'32
}

tiff =
{
	\override Stem.direction = #UP
	b'64
}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%% Taks with fingerings %%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
tak_i =
{
	\override Stem.direction = #UP
	b'4-1
}
tak_iii =
{
	\override Stem.direction = #UP
	b'4-3
}

ta_i =
{
	\override Stem.direction = #UP
	b'8-1
}
ta_i_closeBeam =
{
	\override Stem.direction = #UP
	b'8-1]
}

ta_iii =
{
	\override Stem.direction = #UP
	b'8-3
}
ta_iii_closeBeam =
{
	\override Stem.direction = #UP
	b'8-3]
}

ti_i =
{
	\override Stem.direction = #UP
	b'16-1
}
ti_i_closeBeam =
{
	\override Stem.direction = #UP
	b'16-1]
}

ti_iii =
{
	\override Stem.direction = #UP
	b'16-3
}

tif_i =
{
	\override Stem.direction = #UP
	b'32-1
}
tif_iii =
{
	\override Stem.direction = #UP
	b'32-3
}


tiff_i =
{
	\override Stem.direction = #UP
	b'64-1
}
tiff_iii =
{
	\override Stem.direction = #UP
	b'64-3
}





%%%%%%%%%%%%%%%%%%
%%%%%% Saks %%%%%%
%%%%%%%%%%%%%%%%%%


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
saf =
{
	\override Stem.direction = #UP
	\override NoteHead.style = #'cross
	b'16
	\revert NoteHead.style
}



%%%%%%%%%%%%%%%%%%
%%%%%% Baqs %%%%%%
%%%%%%%%%%%%%%%%%%
ba =
{
	\override Stem.direction = #UP
	\override NoteHead.style = #'harmonic
	b'8
	\revert NoteHead.style
}
baf =
{
	\override Stem.direction = #UP
	\override NoteHead.style = #'harmonic
	b'16
	\revert NoteHead.style
}



%%%%%%%%%%%%%%%%%%%
%%%%% Special %%%%%
%%%%%%%%%%%%%%%%%%%


hak =
{
	\override Stem.direction = #UP
	\override NoteHead.style = #'xcircle
	b'4
	\revert NoteHead.style
}



sep =
{
	\bar "!"
}






setupArabicRhythmStaff =
{
	\pointAndClickOff
	\override Staff.Clef.stencil = ##f
	\numericTimeSignature

	\override Staff.StaffSymbol.line-count = #1
}