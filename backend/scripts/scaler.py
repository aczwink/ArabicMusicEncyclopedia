#!/usr/bin/env python3
from fractions import Fraction;
import os.path;
import subprocess;
import svgwrite
import sys;

c_baseFontSize = 24;
noteWidth = 20;
noteHeight = 20.0;
ajnasSpace = c_baseFontSize + noteHeight/3;
marginLeft = noteWidth;
noteSpacing = 1.5* noteWidth;
clefWidth = 32;
c_notePartStart = marginLeft + clefWidth + noteSpacing;


def addArc(dwg, current_group, p0, p1, radius):
    """ Adds an arc that bulges to the right as it moves from p0 to p1 """
    args = {'x0':p0[0], 
        'y0':p0[1], 
        'xradius':radius, 
        'yradius':radius, 
        'ellipseRotation':0, #has no effect for circles
        'x1':(p1[0]-p0[0]), 
        'y1':(p1[1]-p0[1])}
    current_group.add(dwg.path(d="M %(x0)f,%(y0)f a %(xradius)f,%(yradius)f %(ellipseRotation)f 0,0 %(x1)f,%(y1)f"%args,
             fill="none", 
             stroke='black', stroke_width=3
            ))


def AddCenteredText(drawing, text, x1, x2, y1, y2):
	r = drawing.rect((x1, y1), (x2-x1, y2-y1), fill="none");
	t = drawing.text(text, insert=(x1 + (x2-x1)/2, y1 + (y2-y1)/2), fill='black', dominant_baseline="middle", text_anchor="middle", font_size=str(c_baseFontSize));
	g = drawing.g();
	g.add(r);
	g.add(t);
	drawing.add(g);

def DeltaToSign(delta):
	if(delta == -Fraction(1, 2)):
		return "b";
	if(delta == -Fraction(1, 4)):
		return "hb";
	if(delta == Fraction(0, 1)):
		return "n";
	if(delta == Fraction(1, 4)):
		return "h#";
	if(delta == Fraction(1, 2)):
		return "#";
	raise NotImplementedError(delta);
	

valueBij = {'c': 0, 'd': 1, 'e': 2, 'f': 3, 'g': 4, 'a': 5, 'b': 6};
valueBij_inv = {v: k for k, v in valueBij.items()};
class Note:
	def __init__(this, value):
		this.__value = valueBij[value[0]];
		accLen = 1;
		
		if(value[1] == "b"):
			this.__delta = -Fraction(1, 2);
		elif(value[1:3] == "hb"):
			this.__delta = -Fraction(1, 4);
			accLen += 1;
		elif(value[1] == "n"):
			this.__delta = Fraction(0, 1);
		elif(value[1:3] == "h#"):
			this.__delta = Fraction(1, 4);
			accLen += 1;
		elif(value[1] == "#"):
			this.__delta = Fraction(1, 2);
		else:
			raise NotImplementedError(value[1], value[1:3], value);
		this.__octave = int(value[1 + accLen]);
		
	def __le__(this, other):
		if(this.__octave < other.__octave):
			return True;
		if(this.__octave == other.__octave):
			return this.__value <= other.__value;
		return False;
		
	def __lt__(this, other):
		if(this.__octave < other.__octave):
			return True;
		if(this.__octave == other.__octave):
			return this.__value < other.__value;
		return False;
		
	def __str__(this):
		return (valueBij_inv[this.__value]) + DeltaToSign(this.__delta) + str(this.__octave);
		
	def AdvanceStep(this, interval):
		if(this.__value == 2 or this.__value == 6):
			stepSize = Fraction(1, 2);
		else:
			stepSize = Fraction(1, 1);
		stepSize -= this.__delta;
			
		#update value
		nextValue = valueBij_inv[((this.__value + 1) % 7)];
			
		#update sign
		left = interval - stepSize;
		nextSign = DeltaToSign(left);
		
		#update octave
		nextOctave = this.__octave;
		if(this.__value == 6):
			nextOctave += 1;
			
		return Note(nextValue + nextSign + str(nextOctave));
		
	def DistanceTo(this, other):
		start = this.__value;
		end = other.__value;
			
		interval = Fraction(0, 1);			
		#make start and end neutral
		interval -= this.__delta;
		interval += other.__delta;
		
		while(start != end):
			if(start == 2 or start == 6):
				stepSize = Fraction(1, 2);
			else:
				stepSize = Fraction(1, 1);
			interval += stepSize;
			start = (start+1)%7;
			
		return interval;
		
	def GetAccidentalText(this):
		s = DeltaToSign(this.__delta);
		if(s == "b"):
			return "";
		if(s == "hb"):
			return "";
		if(s == "n"):
			return "";
		if(s == "h#"):
			return "";
		if(s == "#"):
			return "";
		else:
			raise NotImplementedError(s);
		
	def GetEmmentalerText(this, important = False):
		if(important):
			return '';
		return '';
		
	def GetNumberOfDiatonicStepsTo(this, other):
		return (other.__octave - this.__octave)*7 + (other.__value - this.__value);
		
	def GetNumberOfHelpLines(this):
		l = Note("cn4");
		if(this <= l):
			return 1 + (this.GetNumberOfDiatonicStepsTo(l) // 2);
		h = Note("gn5");
		if(this > h):
			return h.GetNumberOfDiatonicStepsTo(this) // 2;
		return 0;
		
	def GetStepsToG4(this):
		ref = Note("gn4");
		return this.GetNumberOfDiatonicStepsTo(ref);
		
	def HasAccidental(this):
		return this.__delta != 0;
		
inFileName = sys.argv[1];
with open(inFileName, "r", encoding='utf-8') as f:
	noteAndIntervals = f.readline().split(" ");
	ajnasLines = f.readlines();
	
ajnas = [];
for jinsLine in ajnasLines:
	l = jinsLine.split(" ");
	ajnas.append((int(l[0])-1, int(l[1])-1, " ".join(l[2:])));
	
base = Note(noteAndIntervals[0]);
noteAndIntervals = noteAndIntervals[1:];
intervals = [Fraction(x) for x in noteAndIntervals];

notes = [base];
for interval in intervals:
	nextNote = notes[-1].AdvanceStep(interval);
	notes.append(nextNote);

name, ext = os.path.splitext(os.path.split(inFileName)[1]);


marginTop = noteHeight;
noteSpace = 2*noteWidth;
strokeWidth = 1;

if(ajnas):
	origMarginTop = marginTop;
	marginTop += ajnasSpace;

#eval note positions
notePos = [];
i = 0;
x = c_notePartStart;
for note in notes:
	steps = note.GetStepsToG4();
	y = marginTop + (3.0 * noteHeight) + float(steps) * noteHeight/2.0;
	pos = (x + (noteSpace - noteWidth)/2, y);
	notePos.append(pos);
	i += 1;
	x += noteSpace + noteSpacing;
totalRight = notePos[-1][0] + noteWidth + noteSpacing;
srcY = max(notePos[0][1] + noteHeight, marginTop + 5 * noteHeight + noteHeight/4);
textY = srcY + 3.5 * noteHeight;

targetWidth = totalRight + marginLeft;
targetHeight = textY;
if(ajnas):
	targetHeight += ajnasSpace;
out = svgwrite.Drawing(name + '.svg', size=(str(targetWidth) + 'px', str(targetHeight) + 'px'), viewBox=('0 0 ' + str(targetWidth) + ' ' + str(targetHeight)));

out.defs.add(out.style('@font-face{ font-family: "Emmentaler-26"; src: url("emmentaler-26.otf");}'))

#draw notes
extra = {"font-family": "Emmentaler-26", "font-size": "64"};
i = 0;
for note in notes:
	isImportant = not not list(filter(lambda x: x[0] == i, ajnas));
	out.add(out.text(note.GetEmmentalerText(isImportant), insert=notePos[i], fill='black', **extra));
	
	if(note.HasAccidental()):
		accPos = (notePos[i][0] - noteWidth*3/4, notePos[i][1]);
		out.add(out.text(note.GetAccidentalText(), insert=accPos, fill='black', **extra));
	
	if(note.GetNumberOfHelpLines() != 0):
		x = notePos[i][0] - noteWidth*0.5;
		x2 = x + noteWidth*2.05;
		
		for j in range(0, note.GetNumberOfHelpLines()):
			y = marginTop + (5.0 * noteHeight) + (j) * noteHeight/2.0;
			out.add(out.line((x, y), (x2, y), stroke="black", stroke_width = "3", stroke_linecap="round"));
	i += 1;
	
#draw the clef
out.add(out.text("", insert=(marginLeft, marginTop + (3.0 * noteHeight)), fill='black', **extra))

#draw note lines
for i in range(0, 5):
	y = marginTop + i * noteHeight;
	out.add(out.line((marginLeft, y), (totalRight, y), stroke="black"));		
	
	
#draw ajnas
padding = noteWidth/8;
lowestLowAjnasY = 100000;
lastBelow = False;
if(ajnas):
	marginTop = origMarginTop; #restore
	
	for i in range(0, len(ajnas)):
		jins = ajnas[i];
		
		if(i > 0):
			endLast = ajnas[i-1][0] + ajnas[i-1][1];
		else:
			endLast = -1;
		startThis = jins[0];
		
		print(endLast, startThis);
		
		if( (endLast >= startThis) and not lastBelow ):
			belowY = notePos[jins[0]][1] + noteHeight;
			highY = belowY + noteHeight*3/4;
			lowY = belowY;
			
			lowTextY = highY + c_baseFontSize * 0.5;
			highTextY = highY + c_baseFontSize;
			
			lastBelow = True;
		else:
			lowY = ajnasSpace + noteHeight*3/4;
			highY = ajnasSpace;
			
			lowTextY = 0;
			highTextY = highY;
			
			lastBelow = False;
		
		startNote = notePos[jins[0]];
		endNote = notePos[jins[0] + jins[1]];
		w1 = w2 = noteWidth;
		x1 = startNote[0] + w1*0.5 + padding;
		x2 = endNote[0] + w2*0.5 - padding;
		
		out.add(out.line((x1, highY), (x2, highY), stroke="black"));
		out.add(out.line((x1, lowY), (x1, highY), stroke="black"));
		out.add(out.line((x2, lowY), (x2, highY), stroke="black"));
		
		lowestLowAjnasY = min(lowestLowAjnasY, highTextY);
		
		AddCenteredText(out, jins[2], x1, x2, lowTextY, highTextY);
else:
	lowestLowAjnasY = 0;

		
#draw steps
lastNote = None;
i = 0;
srcY += lowestLowAjnasY;
textY += lowestLowAjnasY;
targetY = srcY + 1.5 * noteHeight;
for note in notes:
	if(lastNote is not None):
		d = lastNote.DistanceTo(note);
		last = notePos[i-1];
		current = notePos[i];
		wc = wl = noteWidth;
		
		x1 = last[0] + wl*0.5 + padding;
		x2 = current[0] + wc*0.5 - padding;
		center = last[0] + wl/2 + ((current[0]+wc/2) - (last[0]+wl/2))/2;
		
		if(d == Fraction(1, 2)):
			out.add(out.line((x1, srcY), (center, targetY), stroke="black", stroke_width = "3"));
			out.add(out.line((x2, srcY), (center, targetY), stroke="black", stroke_width = "3"));
		elif(d == Fraction(3, 4)):
			current_group = out.add(out.g(stroke='black', stroke_width=3, fill='none', fill_opacity=0 ));
			addArc(out, current_group, (x1, srcY), (x2, srcY), 5);
		elif(d == Fraction(1, 1)):
			out.add(out.line((x1, srcY), (x1, targetY), stroke="black", stroke_width = "3"));
			out.add(out.line((x2, srcY), (x2, targetY), stroke="black", stroke_width = "3"));
			out.add(out.line((x1, targetY), (x2, targetY), stroke="black", stroke_width = "3"));
		elif(d == Fraction(3, 2)):
			brx = x1 + noteWidth;
			bry = srcY;
			sfx = 1;
			sfy = 1;
			out.add(out.text("}", stroke="black", transform="rotate(90, " + str(brx) + ", " + str(bry) + ") translate(" + str(brx) + ", " + str(bry) + ") scale(" + str(sfx) + ", " + str(sfy) + ")", **extra));
		else:
			raise NotImplementedError(d);
			
		AddCenteredText(out, str(d), x1, x2, targetY, textY);
	lastNote = note;
	i += 1;
		
out.save();

subprocess.call(["inkscape", name + ".svg", "-e", name + ".png", "--without-gui"]);
