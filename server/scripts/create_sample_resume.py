import subprocess
import sys
import os

# Install reportlab if not present
try:
    import reportlab
except ImportError:
    print("Installing reportlab library...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "reportlab"])

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

pdf_path = os.path.abspath("sample_resume.pdf")
print(f"Generating sample resume PDF at: {pdf_path}")

doc = SimpleDocTemplate(pdf_path, pagesize=letter,
                        rightMargin=72, leftMargin=72,
                        topMargin=72, bottomMargin=72)

styles = getSampleStyleSheet()
story = []

# Title
title_style = ParagraphStyle(
    'TitleStyle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=24,
    leading=28,
    textColor=colors.HexColor('#0a2f7c'),
    spaceAfter=12
)
story.append(Paragraph("Aarav Sharma", title_style))

# Subtitle/Role
sub_style = ParagraphStyle(
    'SubStyle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=18,
    textColor=colors.HexColor('#1656d8'),
    spaceAfter=20
)
story.append(Paragraph("Senior Machine Learning & Computer Vision Developer", sub_style))

# Contact Details
body_style = ParagraphStyle(
    'BodyStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#222325'),
    spaceAfter=15
)
story.append(Paragraph("Email: aarav.sharma@example.com | LinkedIn: linkedin.com/in/aarav-sharma-ml", body_style))
story.append(Spacer(1, 10))

# Summary
section_style = ParagraphStyle(
    'SectionStyle',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=18,
    textColor=colors.HexColor('#0a2f7c'),
    spaceBefore=10,
    spaceAfter=6
)
story.append(Paragraph("Professional Summary", section_style))
summary_text = (
    "Highly skilled Machine Learning Engineer with 5+ years of experience specializing in computer vision, "
    "image segmentation, and deep neural networks. Proven track record of developing high-performance "
    "pipelines using PyTorch, TensorFlow, and OpenCV to solve complex defect detection and spatial mapping tasks."
)
story.append(Paragraph(summary_text, body_style))
story.append(Spacer(1, 10))

# Experience
story.append(Paragraph("Work Experience", section_style))
exp_title = ParagraphStyle(
    'ExpTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=15,
    textColor=colors.HexColor('#101828'),
    spaceAfter=2
)
story.append(Paragraph("Lead Machine Learning Developer - VisionAI Tech (2022 - Present)", exp_title))
exp_desc = (
    "Designed and trained convolutional neural networks (CNNs) for real-time defect detection and "
    "high-fidelity image segmentation. Integrated OpenCV filters and PyTorch segmentation models to reduce "
    "processing latency by 35% on edge platforms."
)
story.append(Paragraph(exp_desc, body_style))
story.append(Spacer(1, 10))

# Skills
story.append(Paragraph("Core Skills", section_style))
skills_text = (
    "<b>Programming Languages & Frameworks:</b> Python, PyTorch, TensorFlow, OpenCV, NumPy, Scikit-Learn<br/>"
    "<b>Specializations:</b> Convolutional Neural Networks, Image Segmentation, Object Detection, Generative AI"
)
story.append(Paragraph(skills_text, body_style))

# Build Document
doc.build(story)
print("Resume PDF generated successfully!")
