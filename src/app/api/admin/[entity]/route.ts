import { NextRequest, NextResponse } from 'next/server';
import {
  getProfile,
  updateProfile,
  getProjects,
  saveProject,
  deleteProject,
  getExperiences,
  saveExperience,
  deleteExperience,
  getSkills,
  saveSkills,
  getEducations,
  saveEducation,
  deleteEducation,
  getCertifications,
  saveCertification,
  deleteCertification,
  getAchievements,
  saveAchievement,
  deleteAchievement,
  getServices,
  saveService,
  deleteService,
  getNotes,
  saveNote,
  deleteNote,
  getMessages,
  updateMessageStatus,
  deleteMessage,
  getSettings,
  saveSettings
} from '@/lib/dataStore';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;

    switch (entity) {
      case 'profile':
        return NextResponse.json(await getProfile());
      case 'projects':
        return NextResponse.json(await getProjects());
      case 'experience':
        return NextResponse.json(await getExperiences());
      case 'skills':
        return NextResponse.json(await getSkills());
      case 'education':
        return NextResponse.json(await getEducations());
      case 'certifications':
        return NextResponse.json(await getCertifications());
      case 'achievements':
        return NextResponse.json(await getAchievements());
      case 'services':
        return NextResponse.json(await getServices());
      case 'notes':
        return NextResponse.json(await getNotes());
      case 'messages':
        return NextResponse.json(await getMessages());
      case 'settings':
        return NextResponse.json(await getSettings());
      default:
        return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 404 });
    }
  } catch (error) {
    console.error('API Admin GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const body = await req.json();

    switch (entity) {
      case 'profile':
        return NextResponse.json(await updateProfile(body));
      case 'projects':
        return NextResponse.json(await saveProject(body));
      case 'experience':
        return NextResponse.json(await saveExperience(body));
      case 'skills':
        return NextResponse.json(await saveSkills(body));
      case 'education':
        return NextResponse.json(await saveEducation(body));
      case 'certifications':
        return NextResponse.json(await saveCertification(body));
      case 'achievements':
        return NextResponse.json(await saveAchievement(body));
      case 'services':
        return NextResponse.json(await saveService(body));
      case 'notes':
        return NextResponse.json(await saveNote(body));
      case 'messages':
        if (body.action === 'status') {
          return NextResponse.json(await updateMessageStatus(body.id, body.status));
        }
        return NextResponse.json({ error: 'Unsupported message action' }, { status: 400 });
      case 'settings':
        return NextResponse.json(await saveSettings(body));
      default:
        return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 404 });
    }
  } catch (error) {
    console.error('API Admin POST error:', error);
    return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id query parameter' }, { status: 400 });
    }

    switch (entity) {
      case 'projects':
        return NextResponse.json(await deleteProject(id));
      case 'experience':
        return NextResponse.json(await deleteExperience(id));
      case 'education':
        return NextResponse.json(await deleteEducation(id));
      case 'certifications':
        return NextResponse.json(await deleteCertification(id));
      case 'achievements':
        return NextResponse.json(await deleteAchievement(id));
      case 'services':
        return NextResponse.json(await deleteService(id));
      case 'notes':
        return NextResponse.json(await deleteNote(id));
      case 'messages':
        return NextResponse.json(await deleteMessage(id));
      default:
        return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 404 });
    }
  } catch (error) {
    console.error('API Admin DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
